import { auth } from "@/auth";
import FreeTrailMainPage from "@/components/startFreeTrial/FreeTrailMainPage";

const page = async () => {
  const session = await auth();
  return (
    <div>
      <FreeTrailMainPage session={session} />
    </div>
  );
};

export default page;
