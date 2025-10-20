# Authentication Service Setup Guide

This project includes a complete authentication service built with Supabase. Here's how to set it up and use it.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

You can get these values from your Supabase project dashboard:
- Go to [Supabase](https://supabase.com)
- Create a new project or select an existing one
- Go to Settings > API
- Copy the Project URL and anon/public key

### 2. Supabase Configuration

The authentication service is already configured to work with Supabase's built-in auth features. Make sure your Supabase project has:

1. **Email Authentication enabled**: Go to Authentication > Settings > Auth Providers
2. **Email templates configured**: Go to Authentication > Settings > Email Templates
3. **Site URL configured**: Set your site URL in Authentication > Settings > Site URL

### 3. Optional: OAuth Providers

To enable Google and GitHub OAuth:

1. Go to Authentication > Settings > Auth Providers
2. Enable Google and/or GitHub
3. Configure the OAuth app credentials

## Features Included

### Authentication Components

- **AuthContext**: React context for managing authentication state
- **ProtectedRoute**: Component that requires authentication
- **Login**: Email/password and OAuth login
- **Register**: User registration with email verification
- **ForgotPassword**: Password reset request
- **ResetPassword**: Password reset form
- **Profile**: User profile management

### Available Routes

- `/login` - Sign in page
- `/register` - Sign up page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form (accessed via email link)
- `/profile` - User profile (protected route)

### Authentication Methods

1. **Email/Password**: Standard email and password authentication
2. **OAuth**: Google and GitHub sign-in (requires configuration)
3. **Password Reset**: Email-based password reset flow
4. **Email Verification**: Automatic email verification for new accounts

## Usage Examples

### Using the AuthContext

```jsx
import { useAuth } from './components/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return <div>Welcome {user.email}!</div>;
  }
  
  return <div>Please sign in</div>;
}
```

### Protecting Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### Manual Authentication

```jsx
import { useAuth } from './components/AuthContext';

function LoginComponent() {
  const { signIn, signUp, signOut } = useAuth();
  
  const handleLogin = async (email, password) => {
    const { error } = await signIn(email, password);
    if (error) console.error('Login failed:', error.message);
  };
  
  const handleRegister = async (email, password, metadata) => {
    const { error } = await signUp(email, password, metadata);
    if (error) console.error('Registration failed:', error.message);
  };
  
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) console.error('Logout failed:', error.message);
  };
}
```

## Security Features

- **Secure password handling**: Passwords are hashed and never stored in plain text
- **Email verification**: New accounts require email verification
- **Password reset**: Secure password reset via email links
- **Session management**: Automatic session handling and refresh
- **OAuth integration**: Secure third-party authentication
- **Protected routes**: Easy route protection with authentication checks

## Customization

### Styling
All components use Tailwind CSS classes and can be easily customized by modifying the class names.

### Email Templates
Customize email templates in your Supabase dashboard under Authentication > Settings > Email Templates.

### User Metadata
Extend user profiles by modifying the registration form and updating the user metadata structure.

### Additional Providers
Add more OAuth providers by enabling them in Supabase and updating the login components.

## Troubleshooting

### Common Issues

1. **Environment variables not working**: Make sure your `.env` file is in the root directory and variables start with `REACT_APP_`

2. **OAuth not working**: Ensure OAuth apps are properly configured in your provider (Google/GitHub) and the credentials are added to Supabase

3. **Email not sending**: Check your Supabase email settings and make sure SMTP is configured

4. **Password reset not working**: Verify the site URL is correctly set in Supabase settings

### Support

For more detailed documentation, visit the [Supabase Auth documentation](https://supabase.com/docs/guides/auth). 