import { db } from '@/server/db';
import { userTable } from '@/server/db/schema';

export const runtime = 'edge';

export const getUsers = async () => {
  'use server';

  return await db.select().from(userTable);
};

/*export const createCustomerWithCustomId = async (formData: FormData) => {
  'use server';

  const customerId = formData.get('customerId');

  try {
    await db.insert(users).values({
      customerId: Number(customerId),
      companyName: 'Alfreds Futterkiste',
      contactName: 'Maria Anders',
    });

    console.log('Customer inserted successfully.');
  } catch (error) {
    console.error('Error inserting customer:', error);
  } finally {
    revalidatePath('/');
  }
};*/
