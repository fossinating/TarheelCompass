import ReactGA from "react-ga4";

export const initGA = (id: string) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(id);
  }
  console.log(`Not initializing GA because NODE_ENV is '${process.env.NODE_ENV}'`)
};