"use client";

const Watermark = () => {
  return (
    <div className="w-full py-4 text-center border-t bg-secondary/30">
      <p className="text-[10px] text-muted-foreground/60">
        포폴링크로 5분 만에 제작됨 · Made with{" "}
        <a
          href="https://pofolink.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent/60 hover:text-accent transition-colors"
        >
          PoFoLink
        </a>
      </p>
    </div>
  );
};

export default Watermark;
