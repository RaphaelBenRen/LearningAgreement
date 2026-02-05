-- Function to handle new message notifications
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
  app_record RECORD;
  sender_role user_role;
  student_id_val UUID;
  major_head_id_val UUID;
  international_profiles RECORD;
BEGIN
  -- Get application details (student and major head)
  SELECT student_id, major_head_id INTO app_record
  FROM public.applications
  WHERE id = NEW.application_id;

  student_id_val := app_record.student_id;
  major_head_id_val := app_record.major_head_id;

  -- Get sender's role
  SELECT role INTO sender_role
  FROM public.profiles
  WHERE id = NEW.sender_id;

  -- LOGIC:
  -- 1. If sender is STUDENT -> Notify Major Head AND International Service
  -- 2. If sender is MAJOR HEAD -> Notify Student
  -- 3. If sender is INTERNATIONAL -> Notify Student

  IF sender_role = 'student' THEN
    -- Notify Major Head
    INSERT INTO public.notifications (user_id, application_id, message, link)
    VALUES (
      major_head_id_val,
      NEW.application_id,
      'Nouveau message de ' || (SELECT full_name FROM public.profiles WHERE id = NEW.sender_id),
      '/admin/application/' || NEW.application_id
    );

    -- Notify ALL International Service users
    FOR international_profiles IN SELECT id FROM public.profiles WHERE role = 'international' LOOP
      INSERT INTO public.notifications (user_id, application_id, message, link)
      VALUES (
        international_profiles.id,
        NEW.application_id,
        'Nouveau message de ' || (SELECT full_name FROM public.profiles WHERE id = NEW.sender_id),
        '/international/application/' || NEW.application_id
      );
    END LOOP;

  ELSIF sender_role = 'major_head' THEN
    -- Notify Student
    INSERT INTO public.notifications (user_id, application_id, message, link)
    VALUES (
      student_id_val,
      NEW.application_id,
      'Nouveau message de votre responsable pédagogique',
      '/application/' || NEW.application_id
    );

  ELSIF sender_role = 'international' THEN
     -- Notify Student
    INSERT INTO public.notifications (user_id, application_id, message, link)
    VALUES (
      student_id_val,
      NEW.application_id,
      'Nouveau message du Service International',
      '/application/' || NEW.application_id
    );
     -- Notify Major Head (Optional but good for transparency)
     INSERT INTO public.notifications (user_id, application_id, message, link)
    VALUES (
      major_head_id_val,
      NEW.application_id,
      'Nouveau message du Service International',
      '/admin/application/' || NEW.application_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();
