import { Client } from '@notionhq/client';

// Test file to verify Notion connection and database structure
const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_KEY,
});

export const testNotionConnection = async () => {
  try {
    console.log('Testing Notion connection...');
    
    // Test 1: Basic connection
    const user = await notion.users.me({});
    console.log('✅ Connected to Notion as:', user.name || user.id);
    
    // Test 2: Search for databases
    const searchResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      },
      query: 'calendar'
    });
    
    console.log('📊 Found databases:', searchResponse.results.length);
    
    if (searchResponse.results.length === 0) {
      console.log('❌ No calendar database found');
      console.log('💡 Please create a database in Notion with these properties:');
      console.log('   - Title (title property)');
      console.log('   - Date (date property)');
      console.log('   - Time (select property: 09:00, 10:00, 11:00, etc.)');
      console.log('   - Description (rich_text property)');
      console.log('   - Location (rich_text property)');
      return false;
    }
    
    // Test 3: Check database structure
    const database = searchResponse.results[0] as any;
    console.log('✅ Found database:', database.title?.[0]?.plain_text || 'Untitled');
    console.log('📋 Database properties:', Object.keys(database.properties || {}));
    
    // Test 4: Query today's events
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const queryResponse = await notion.databases.query({
      database_id: database.id,
      filter: {
        and: [
          {
            property: 'Date',
            date: {
              on_or_after: startOfDay.toISOString().split('T')[0],
            },
          },
          {
            property: 'Date',
            date: {
              before: endOfDay.toISOString().split('T')[0],
            },
          },
        ],
      },
    });
    
    console.log('📅 Today\'s events:', queryResponse.results.length);
    
    queryResponse.results.forEach((page: any, index) => {
      console.log(`   ${index + 1}. ${page.properties.Title?.title?.[0]?.plain_text || 'No title'}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Notion connection failed:', error);
    return false;
  }
};
