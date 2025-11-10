"use client";

export default function MaxWidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6 lg:px-8 ">{children}</div>
    </div>
  );
}
