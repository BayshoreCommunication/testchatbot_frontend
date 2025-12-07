import { auth } from "@/auth";
import LandingPage from "@/components/landingPage/MainPage";

const page = async () => {
  const session = await auth();

  // Transform session to match LandingPage's expected type
  const transformedSession = session
    ? {
        user: session.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name === null ? undefined : session.user.name,
            }
          : undefined,
      }
    : null;

  return (
    <div>
      <LandingPage session={transformedSession} />
    </div>
  );
};

export default page;
