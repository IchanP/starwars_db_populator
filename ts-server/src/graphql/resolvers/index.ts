// Helper methods for resolving data

import { Context } from "../../context";

// Helper function to handle common logic
export const withContext = async (
  cxt: any,
  callback: (context: Context) => any
) => {
  const context = cxt as Context;
  return await callback(context);
};
