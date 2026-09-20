import { Button } from "@/components/base/button";

export function CtaBanner() {
  return (
    <section className="landing py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8 text-center">
        <h2 className="text-balance">Stop guessing. Start previewing.</h2>
        <div className="mt-10">
          <Button asChild>
            <a href="/auth?intent=signup">Get started</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
