import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// 1️⃣ Register Google fonts manually (must be hosted or imported)
// Roboto
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});
// Lato
Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: "bold" },
  ],
});

// Montserrat
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "/fonts/Montserrat-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Montserrat-Bold.ttf", fontWeight: "bold" },
  ],
});
//noto serif
Font.register({
  family: "NotoSerif",
  fonts: [
    { src: "/fonts/NotoSerif-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/NotoSerif-Bold.ttf", fontWeight: "bold" },
  ],
});
//opoen
Font.register({
  family: "OpenSans",
  fonts: [
    { src: "/fonts/OpenSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/OpenSans-Bold.ttf", fontWeight: "bold" },
  ],
});
// raleway
Font.register({
  family: "Raleway",
  fonts: [
    { src: "/fonts/Raleway-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Raleway-Bold.ttf", fontWeight: "bold" },
  ],
});
// 👉 Register more as needed (Open Sans, Raleway, etc.)

const ResumePDF = ({
  ainame,
  aiphone,
  aiemail,
  aiwebsite,
  ailocation,
  aiobjective,
  aiexperience,
  aieducation,
  aiprojects,
  aiskills,
  themeColor = "#000000",
  fontFamily = "Roboto",
  fontSize = 8,
  hideExperience,
  hideEducation,
  hideProjects,
  hideSkills,
  workExperienceTitle = "WORK EXPERIENCE",
  educationTitle = "EDUCATION",
  projectTitle = "PROJECTS",
  skillsTitle = "SKILLS",
}) => {
  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily, fontSize }]}>
        <View style={styles.inner}>
          {/* Name + Contact */}
          <View style={styles.header}>
            <Text
              style={[
                styles.name,
                { color: themeColor, fontSize: fontSize + 7 },
              ]}
            >
              {ainame}
            </Text>
            <View style={styles.contactRow}>
              {[aiphone, aiemail, aiwebsite, ailocation]
                .filter(Boolean)
                .map((item, idx, arr) => (
                  <Text key={idx} style={styles.contactItem}>
                    {item}
                    {idx < arr.length - 1 ? " | " : ""}
                  </Text>
                ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Objective */}
          <Text style={[styles.sectionTitle, { color: themeColor }]}>
            OBJECTIVE
          </Text>
          <Text style={styles.paragraph}>{aiobjective}</Text>

          <View style={styles.divider} />

          {/* Work Experience */}
          {!hideExperience && (
            <>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                {workExperienceTitle}
              </Text>
              {aiexperience?.map((exp, i) => (
                <View key={i} style={styles.sectionBlock}>
                  <View style={styles.flexRow}>
                    <View>
                      <Text>{exp.jobTitle}</Text>
                      <Text style={styles.bold}>{exp.company}</Text>
                    </View>
                    <Text style={styles.small}>{exp.date}</Text>
                  </View>
                  {(Array.isArray(exp.bullets)
                    ? exp.bullets
                    : exp.bullets?.split("\n") || []
                  )
                    .filter(Boolean)
                    .map((line, bi) => (
                      <Text key={bi} style={styles.bullet}>
                        • {line}
                      </Text>
                    ))}
                </View>
              ))}
              <View style={styles.divider} />
            </>
          )}

          {/* Education */}
          {!hideEducation && (
            <>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                {educationTitle}
              </Text>
              {aieducation?.map((edu, i) => (
                <View key={i} style={styles.sectionBlock}>
                  <Text style={styles.bold}>{edu.school}</Text>
                  <View style={styles.flexRow}>
                    <Text>
                      {edu.degree && edu.gpa
                        ? `${edu.degree} - ${edu.gpa}`
                        : edu.degree || edu.gpa || ""}
                    </Text>
                    <Text style={styles.small}>{edu.date}</Text>
                  </View>
                  {edu.details && (
                    <Text style={styles.bullet}>• {edu.details}</Text>
                  )}
                </View>
              ))}
              <View style={styles.divider} />
            </>
          )}

          {/* Projects */}
          {!hideProjects && (
            <>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                {projectTitle}
              </Text>
              {aiprojects?.map((proj, i) => (
                <View key={i} style={styles.sectionBlock}>
                  <Text style={styles.bold}>
                    {proj.title} {proj.tech && `(${proj.tech})`}
                  </Text>
                  {proj.desc && (
                    <Text style={styles.bullet}>• {proj.desc}</Text>
                  )}
                </View>
              ))}
              <View style={styles.divider} />
            </>
          )}

          {/* Skills */}
          {!hideSkills && (
            <>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                {skillsTitle}
              </Text>
              <View style={styles.skillGrid}>
                {aiskills?.map((skill, i) => (
                  <Text key={i} style={styles.skillItem}>
                    • {skill}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDF;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
  },
  inner: {
    paddingHorizontal: 70, // px-[60pt]
    paddingVertical: 35, // py-8
    color: "#171717",
  },
  header: {
    alignItems: "center",
    marginBottom: 3, // mb-3 ≈ 12px, scaled to ~3pt
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 3,
  },
  contactItem: {
    fontSize: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#2e2e2e",
    marginVertical: 8, // my-2
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  paragraph: {
    marginTop: 6,
    fontSize: 11,
  },
  sectionBlock: {
    marginTop: 6, // mt-[6pt]
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "bold",
  },
  small: {
    fontSize: 10,
  },
  bullet: {
    marginTop: 4.5, // mt-[4.5pt]
    fontSize: 11,
  },
  skillGrid: {
    marginTop: 12, // mt-3
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    marginRight: 16, // gap-x-8
    marginBottom: 8, // gap-y-2
    fontSize: 11,
  },
});
