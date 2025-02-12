import { CallContext } from "@/context/CallContext";
import { useContext } from "react";

export const useCall = () => useContext(CallContext);
