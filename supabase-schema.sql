-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  username text unique,
  avatar_url text,
  role text default 'user' check (role in ('user', 'instructor', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  price decimal(10,2) not null,
  currency text default 'EUR' not null,
  thumbnail_url text not null,
  video_preview_url text,
  instructor_id uuid references public.profiles(id) not null,
  category text not null,
  level text not null check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  duration_minutes integer not null,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Course lessons table
create table public.course_lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text not null,
  duration_seconds integer not null,
  "order" integer not null,
  is_free boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Course tests table
create table public.course_tests (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  passing_grade integer default 70 not null,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Test questions table
create table public.test_questions (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references public.course_tests(id) on delete cascade not null,
  question text not null,
  question_type text not null check (question_type in ('multiple_choice', 'true_false', 'short_answer')),
  "order" integer not null,
  points integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Test question options (for multiple choice)
create table public.test_question_options (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.test_questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false not null,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Test answers (for short answer questions)
create table public.test_question_answers (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.test_questions(id) on delete cascade not null,
  answer_text text not null,
  is_case_sensitive boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User test attempts
create table public.user_test_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  test_id uuid references public.course_tests(id) on delete cascade not null,
  score integer not null,
  total_points integer not null,
  percentage integer not null,
  passed boolean not null,
  answers jsonb not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Purchases table
create table public.purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  revolut_order_id text unique not null,
  amount decimal(10,2) not null,
  currency text default 'EUR' not null,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User progress table
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  lesson_id uuid references public.course_lessons(id) on delete cascade not null,
  completed boolean default false,
  progress_seconds integer default 0,
  last_watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- Community posts table
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  media_url text,
  media_type text check (media_type in ('image', 'video', null)),
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Community comments table
create table public.community_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  recipient_id uuid references public.profiles(id) not null,
  content text not null,
  media_url text,
  media_type text check (media_type in ('image', 'video', null)),
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_question_options enable row level security;
alter table public.test_question_answers enable row level security;
alter table public.user_test_attempts enable row level security;
alter table public.purchases enable row level security;
alter table public.user_progress enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Courses policies
create policy "Published courses are viewable by everyone" on public.courses
  for select using (is_published = true or instructor_id = auth.uid());

create policy "Only instructors can create courses" on public.courses
  for insert with check (auth.uid() = instructor_id);

create policy "Only instructors can update their courses" on public.courses
  for update using (auth.uid() = instructor_id);

-- Course lessons policies
create policy "Lessons viewable if course is published or user has purchased" on public.course_lessons
  for select using (
    exists (
      select 1 from public.courses
      where courses.id = course_lessons.course_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

-- Course tests policies
create policy "Tests viewable if course is published or user has purchased" on public.course_tests
  for select using (
    exists (
      select 1 from public.courses
      where courses.id = course_tests.course_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors and admins can manage tests" on public.course_tests
  for all using (
    exists (
      select 1 from public.courses
      where courses.id = course_tests.course_id
      and (courses.instructor_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
      ))
    )
  );

-- Test questions policies
create policy "Questions viewable if test is accessible" on public.test_questions
  for select using (
    exists (
      select 1 from public.course_tests
      join public.courses on courses.id = course_tests.course_id
      where course_tests.id = test_questions.test_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors and admins can manage questions" on public.test_questions
  for all using (
    exists (
      select 1 from public.course_tests
      join public.courses on courses.id = course_tests.course_id
      where course_tests.id = test_questions.test_id
      and (courses.instructor_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
      ))
    )
  );

-- Test question options policies
create policy "Options viewable if question is accessible" on public.test_question_options
  for select using (
    exists (
      select 1 from public.test_questions
      join public.course_tests on course_tests.id = test_questions.test_id
      join public.courses on courses.id = course_tests.course_id
      where test_questions.id = test_question_options.question_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors and admins can manage options" on public.test_question_options
  for all using (
    exists (
      select 1 from public.test_questions
      join public.course_tests on course_tests.id = test_questions.test_id
      join public.courses on courses.id = course_tests.course_id
      where test_questions.id = test_question_options.question_id
      and (courses.instructor_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
      ))
    )
  );

-- Test question answers policies
create policy "Answers viewable if question is accessible" on public.test_question_answers
  for select using (
    exists (
      select 1 from public.test_questions
      join public.course_tests on course_tests.id = test_questions.test_id
      join public.courses on courses.id = course_tests.course_id
      where test_questions.id = test_question_answers.question_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors and admins can manage answers" on public.test_question_answers
  for all using (
    exists (
      select 1 from public.test_questions
      join public.course_tests on course_tests.id = test_questions.test_id
      join public.courses on courses.id = course_tests.course_id
      where test_questions.id = test_question_answers.question_id
      and (courses.instructor_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
      ))
    )
  );

-- User test attempts policies
create policy "Users can view their own test attempts" on public.user_test_attempts
  for select using (auth.uid() = user_id);

create policy "Users can create their own test attempts" on public.user_test_attempts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own test attempts" on public.user_test_attempts
  for update using (auth.uid() = user_id);

-- Purchases policies
create policy "Users can view their own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "Purchases can be created by authenticated users" on public.purchases
  for insert with check (auth.uid() = user_id);

-- User progress policies
create policy "Users can view their own progress" on public.user_progress
  for select using (auth.uid() = user_id);

create policy "Users can update their own progress" on public.user_progress
  for all using (auth.uid() = user_id);

-- Community posts policies
create policy "Posts are viewable by everyone" on public.community_posts
  for select using (true);

create policy "Authenticated users can create posts" on public.community_posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts" on public.community_posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on public.community_posts
  for delete using (auth.uid() = user_id);

-- Community comments policies
create policy "Comments are viewable by everyone" on public.community_comments
  for select using (true);

create policy "Authenticated users can create comments" on public.community_comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update own comments" on public.community_comments
  for update using (auth.uid() = user_id);

create policy "Users can delete own comments" on public.community_comments
  for delete using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages they sent or received" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Authenticated users can send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

create policy "Users can update messages they received (mark as read)" on public.messages
  for update using (auth.uid() = recipient_id);

-- Functions and triggers

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.courses
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.course_lessons
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.purchases
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.user_progress
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.community_posts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.community_comments
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.messages
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.course_tests
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.test_questions
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.user_test_attempts
  for each row execute procedure public.handle_updated_at();

-- Indexes for performance
create index profiles_email_idx on public.profiles(email);
create index profiles_username_idx on public.profiles(username);
create index courses_slug_idx on public.courses(slug);
create index courses_instructor_idx on public.courses(instructor_id);
create index course_lessons_course_idx on public.course_lessons(course_id);
create index purchases_user_idx on public.purchases(user_id);
create index purchases_course_idx on public.purchases(course_id);
create index user_progress_user_idx on public.user_progress(user_id);
create index user_progress_lesson_idx on public.user_progress(lesson_id);
create index community_posts_user_idx on public.community_posts(user_id);
create index community_comments_post_idx on public.community_comments(post_id);
create index messages_sender_idx on public.messages(sender_id);
create index messages_recipient_idx on public.messages(recipient_id);
create index course_tests_course_idx on public.course_tests(course_id);
create index test_questions_test_idx on public.test_questions(test_id);
create index test_question_options_question_idx on public.test_question_options(question_id);
create index test_question_answers_question_idx on public.test_question_answers(question_id);
create index user_test_attempts_user_idx on public.user_test_attempts(user_id);
create index user_test_attempts_test_idx on public.user_test_attempts(test_id);

