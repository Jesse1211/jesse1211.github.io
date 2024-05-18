// import { forwardRef } from "react";
// import { Button, Stack, Typography } from "@mui/joy";
// import { Categories } from "../models/Categories";

// export const Buttons = forwardRef<
//   HTMLDivElement,
//   { setSelectedCategory: (category: Categories) => void }
// >(({ setSelectedCategory }, ref) => {
//   return (
//     <Stack direction="row" spacing={6} ref={ref}>
//       <Button
//         onClick={() => setSelectedCategory("Educations")}
//         style={{ color: "#889def" }}
//         variant="plain"
//       >
//         Educations
//       </Button>
//       <Button
//         onClick={() => setSelectedCategory("Experiences")}
//         style={{ color: "#889def" }}
//         variant="plain"
//       >
//         Experiences
//       </Button>
//       <Button
//         onClick={() => setSelectedCategory("Projects")}
//         style={{ color: "#889def" }}
//         variant="plain"
//       >
//         Projects
//       </Button>
//     </Stack>
//   );
// });

// export const MyComponent = forwardRef(function ({setSelectedCategory, ...props}: { setSelectedCategory: (category: Categories) => void }, ref: React.Ref<HTMLSpanElement>) {
//   setSelectedCategory("Educations");
//   return (

//     <Typography
//       component="span"
//       ref={ref}
//       {...props}
//     >
//       Hello World
//     </Typography>
//   );
// });
