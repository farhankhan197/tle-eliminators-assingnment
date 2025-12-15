import { db } from "@/db/db";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });

  if (!user) {
    return (
      <div className=" flex h-screen w-full items-center justify-center">
        <h1 className="text-5xl text-white">CHAL NIKAL</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl text-white">{user?.name}</h1>
      <h1 className="text-xl text-white">{user?.email}</h1>
    </div>
  );
}
