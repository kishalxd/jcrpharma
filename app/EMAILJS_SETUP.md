# EmailJS Setup Guide

This application uses EmailJS to send email notifications when forms are submitted. Follow these steps to configure EmailJS:

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Verify your email address

## Step 2: Create an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email service provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. In the EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Set up your template with the following variables:
   - **To Email**: `{{to_email}}` (or set default to `general@jcrpharma.co.uk`)
   - **Subject**: `{{title}}`
   - **Body**: `{{body}}`
   - The footer "This is an automated email generated." will be automatically appended to the body
4. Note down your **Template ID** (you'll need this later)

**Note**: The recipient email `general@jcrpharma.co.uk` is automatically included in the email. Make sure your EmailJS template uses `{{to_email}}` in the "To Email" field, or set it as a default value in the template settings.

## Step 4: Get Your Public Key

1. In the EmailJS dashboard, go to **Account** → **General**
2. Find your **Public Key** (also called User ID)
3. Copy this key

## Step 5: Set Environment Variables

Create a `.env` file in the `app` directory (if it doesn't exist) and add the following:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual EmailJS credentials.

## Step 6: Restart Your Development Server

After adding the environment variables, restart your React development server:

```bash
npm start
```

## Email Notifications

Email notifications are automatically sent when:

1. **Candidate Application Form** is submitted (`/candidates/apply`)
2. **Hiring Request Form** is submitted (`/employers/hiring` or via Specialisms page)
3. **Job Application** is submitted (`/jobs/apply/:id`)

## Troubleshooting

- If emails are not being sent, check the browser console for any error messages
- Make sure all environment variables are set correctly
- Verify that your EmailJS service is active and properly configured
- Check that your email template has the correct variable names (`{{title}}` and `{{body}}`)

## Note

Email sending failures will not prevent form submissions from succeeding. If EmailJS is not configured or fails, the form will still save to the database, but a warning will be logged to the console.

