import Image from "next/image";

export function HeroBg() {
  return (
    <Image
      src="/grass1.webp"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover -z-10"
    />
  );
}
