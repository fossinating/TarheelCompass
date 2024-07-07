import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDefaultTerm, selectTerms } from "./redux";
import { TermData } from "./Common";

export function useTerms(): [TermData[]|undefined, string|undefined, Dispatch<SetStateAction<string|undefined>>] {

    const terms = useSelector(selectTerms);
    const defaultTerm = useSelector(selectDefaultTerm);
    const [term, setTerm] = useState<string | undefined>(defaultTerm);

    useEffect(() => {
      if (term === undefined || term === null) {
        setTerm(defaultTerm)
      }
    },[defaultTerm, term])

    return [terms, term, setTerm];
}