import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GoldRule = ({ frame, delay = 0 }) => {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: 48,
        height: 1,
        background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
        margin: "28px auto",
        opacity,
      }}
    />
  );
};

const FadeInText = ({ children, frame, delay = 0, style = {} }) => {
  const opacity = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const translateY = interpolate(frame, [delay, delay + 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const QuietAuthorityVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bannerScale = interpolate(frame, [0, 90], [1.08, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  const overlayOpacity = interpolate(frame, [0, 30], [1, 0.9], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b0b",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Background banner image */}
      <AbsoluteFill>
        <img
          src={staticFile("banner.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transform: `scale(${bannerScale})`,
          }}
          alt=""
        />
        {/* Gradient overlay */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,11,11,0.4) 0%, rgba(11,11,11,0.55) 35%, rgba(11,11,11,0.9) 65%, rgba(11,11,11,0.98) 100%)",
            opacity: overlayOpacity,
          }}
        />
      </AbsoluteFill>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 80,
          textAlign: "center",
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <FadeInText frame={frame} delay={10}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#7a6040",
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              marginBottom: 20,
            }}
          >
            Sanctuary Grace Ministry
          </div>
        </FadeInText>

        <FadeInText frame={frame} delay={20}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 300,
              lineHeight: 0.88,
              color: "#f0ead8",
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            The Quiet
            <br />
            <span
              style={{
                fontStyle: "italic",
                color: "#c9a96e",
                fontSize: 76,
              }}
            >
              Authority
            </span>
          </div>
        </FadeInText>

        <GoldRule frame={frame} delay={40} />

        <FadeInText frame={frame} delay={50}>
          <div
            style={{
              fontStyle: "italic",
              fontSize: 22,
              color: "#b0a898",
              lineHeight: 1.55,
              marginBottom: 32,
              maxWidth: 500,
            }}
          >
            What is silence teaching you?
          </div>
        </FadeInText>

        <FadeInText frame={frame} delay={65}>
          <div
            style={{
              fontSize: 14,
              color: "#807870",
              lineHeight: 1.95,
              marginBottom: 44,
              maxWidth: 480,
              fontFamily: "'Arial', sans-serif",
              fontWeight: 300,
            }}
          >
            An 8-question sacred assessment revealing your Silence Profile
            <br />
            and your breakthrough path.
          </div>
        </FadeInText>

        <FadeInText frame={frame} delay={80}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 24px",
              border: "1px solid rgba(201,169,110,0.4)",
              background: "rgba(11,11,11,0.6)",
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#c9a96e",
                opacity: interpolate(
                  frame % (fps * 2),
                  [0, fps, fps * 2],
                  [1, 0.4, 1],
                  { extrapolateRight: "clamp" }
                ),
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "#7a6040",
                fontFamily: "'Arial', sans-serif",
                fontWeight: 300,
              }}
            >
              <span style={{ color: "#c9a96e", fontFamily: "'Georgia', serif" }}>
                2,847
              </span>{" "}
              SOULS ASSESSED
            </span>
          </div>
        </FadeInText>

        <FadeInText frame={frame} delay={90}>
          <div
            style={{
              padding: "17px 56px",
              border: "1px solid #c9a96e",
              color: "#c9a96e",
              fontFamily: "'Arial', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Begin Your Assessment
          </div>
        </FadeInText>

        <FadeInText frame={frame} delay={100}>
          <div
            style={{
              marginTop: 20,
              fontSize: 10,
              color: "#484840",
              letterSpacing: "0.12em",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            Free · Takes 3 minutes · Reveals your sacred silence type
          </div>
        </FadeInText>
      </AbsoluteFill>

      {/* Background music */}
      <Audio src={staticFile("music1.mp3")} volume={0.3} />
    </AbsoluteFill>
  );
};
