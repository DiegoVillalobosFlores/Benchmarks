"use client";

export default function Button() {
  const handleReload = () => {
    console.log("handle reload");
    window.location.reload();
  };
  return (
    <div>
      <input
        type="button"
        value="Reload this"
        onClick={() => {
          console.log("test");
        }}
      />
    </div>
  );
}
