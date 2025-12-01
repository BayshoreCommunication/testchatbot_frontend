import { auth } from "@/auth";
import LandingPage from "@/components/landingPage/MainPage";

const page = async () => {
  const session = await auth();

  return (
    <div>
      <LandingPage session={session} />
    </div>
  );
};

export default page;
