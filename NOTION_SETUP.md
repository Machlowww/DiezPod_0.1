# Notion Calendar Setup Guide

## 📋 Required Database Structure

Create a new database in Notion with these **exact property names**:

### Properties:
1. **Title** (Type: Title)
   - This will be the event name

2. **Date** (Type: Date)
   - This will be the event date
   - Enable time if you want, but we'll use the Time property instead

3. **Time** (Type: Select)
   - Options: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00, 22:00, 23:00

4. **Description** (Type: Text)
   - Optional event description

5. **Location** (Type: Text)
   - Optional event location

## 🔗 Integration Setup

1. **Create Integration**: Go to notion.com/my-integrations
2. **Share Database**: Click "Share" → "Invite" → Select your integration
3. **Test Connection**: Run the app and check browser console

## 🧪 Testing

When you start the app, check the browser console for:
- ✅ "Connected to Notion as: [your name]"
- ✅ "Found database: [database name]"
- ✅ "Today's events: [number]"

## 📝 Example Event

Create a test event with:
- **Title**: "Meeting with team"
- **Date**: Today's date
- **Time**: "14:00"
- **Description**: "Weekly sync meeting"
- **Location**: "Office"

## 🚀 Troubleshooting

If you see errors in console:
1. Check that database is shared with integration
2. Verify property names match exactly
3. Ensure API key is correct in .env file
4. Make sure you have at least one event for today
