export default function SplashScreen({ message }: { message: string }) {
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <p>{message || "Loading..."}</p>
    </div>
  );
}