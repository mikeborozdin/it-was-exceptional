import { ImageResponse } from "next/og";

export const runtime = "edge";

const renderThing = (thing: string, whatExceptionalAboutIt: string) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        display: "flex",
        fontWeight: "bold",
        fontSize: 60,
      }}
    >
      💎 {thing} is exceptional
    </div>
    <div
      style={{
        marginTop: 50,
      }}
    >
      {whatExceptionalAboutIt}
    </div>
  </div>
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const thing = searchParams.get("thing");
  const whatExceptionalAboutIt = searchParams.get("whatExceptionalAboutIt");

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "#fff",
          background: "#000",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {thing &&
          whatExceptionalAboutIt &&
          renderThing(thing, whatExceptionalAboutIt)}
        {!thing && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 60 }}>💎 It is exceptional</div>

            <div style={{ marginTop: 20 }}>
              Find and share all the exceptional places
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
