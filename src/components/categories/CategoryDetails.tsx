// import { Typography, Stack } from "@mui/joy";
// import { FC } from "react";
// import { Education } from "./Education";
// import { Experience } from "./Experience";
// import { Projects } from "./Projects";
// import { Categories } from "../../models/Categories";
// import { motion } from "framer-motion";

// export const CategoryDetails: FC<{ category: Categories }> = ({ category }) => {
//   return (
//     <motion.div
//       className={category}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       // style={{
//       //   backgroundColor:
//       //     category === "Educations"
//       //       ? "purple"
//       //       : category === "Experiences"
//       //       ? "black"
//       //       : "yellow",
//       // }}
//     >
//       <Stack spacing={{ xs: 1, sm: 2 }} overflow="auto" width={1}>
//         {category === "Educations" ? (
//           <>
//             <Typography level="title-lg" fontWeight="lg" textColor="#fff">
//               Education
//             </Typography>
//             <Education />
//             <Education />
//             <Education />
//             <Education />
//             <Education />
//             <Education />
//           </>
//         ) : category === "Experiences" ? (
//           <>
//             <Typography level="title-lg" fontWeight="lg" textColor="#fff">
//               Experiences
//             </Typography>
//             <Experience />
//             <Experience />
//             <Experience />
//             <Experience />
//             <Experience />
//             <Experience />
//           </>
//         ) : category === "Projects" ? (
//           <>
//             <Typography level="title-lg" fontWeight="lg" textColor="#fff">
//               Projects
//             </Typography>
//             <Projects />
//             <Projects />
//             <Projects />
//             <Projects />
//             <Projects />
//             <Projects />
//           </>
//         ) : (
//           <></>
//         )}
//       </Stack>
//     </motion.div>
//   );
// };
