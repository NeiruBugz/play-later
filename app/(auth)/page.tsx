import GoogleSignIn from "@/src/auth/ui/google-sign-in";

export default function AuthPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          PlayLater – Your Personal Gaming Queue
        </h1>
        <p className="py-6 text-2xl">
          PlayLater is the ultimate gaming backlog manager designed for gamers
          who want to keep track of their games and plan their next gaming
          sessions. With PlayLater, you can easily add your favorite games to
          your backlog, mark them as played, and set your own priorities.
        </p>
        <p className="py-6 text-2xl">
          PlayLater helps you stay on top of your gaming queue and never miss a
          game you wanted to play. Hit sign in button and start playing the
          games you&apos;ve always wanted to try!
        </p>
      </div>
      <GoogleSignIn />
    </section>
  );
}
