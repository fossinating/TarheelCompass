import { getUsers } from '@/server/functions/users';

export const runtime = 'edge';

export default async function Home() {
  'use server';

  // either use server actions
  const users = await getUsers();

  // or fetch the api
  // const response = await fetch(`http://localhost:3000/api`);
  // const customers = (await response.json()).result; // <-- you will have to work with types quite a bit

  return (
    <div>
      <p>Your customer IDs</p>
      <ul>
        {users.map((customer) => (
          <li key={customer.id}>{customer.id}</li>
        ))}
      </ul>
      <p>end</p>
    </div>
  );
}
