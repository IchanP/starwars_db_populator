// Helper methods for resolving data

import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "../../context";
import { FieldNode, SelectionNode } from "graphql";

// Helper function to handle common logic
export const withContext = async (
  cxt: any,
  callback: (context: Context) => any
) => {
  const context = cxt as Context;
  return await callback(context);
};

const isFieldNode = (selection: SelectionNode): selection is FieldNode =>
  selection.kind === "Field";

// NOTE - Not really sure how to type the context model...
/**
 *
 * @param {SelectionNode[]} selections - Array of field nodes to match with queryField.
 * @param {string} queryField - The query field that the selection must contain for the db search to execute.
 * @param {any} contextModel - The prisma context model, including the schema model to search in.
 * Example: context.prisma.starwars_film_characters .
 * @param {any} identifier - The identifier used to search the whereProperty column.
 * @param {string} whereProperty - The identifier field to search the table on. Like "id" or "transport_ptr_id".
 * @param {string} includeProperty - The prisma model to include in the return object.
 * @returns {array<any>} - Returns an array of the objects or null.
 */
export const findManyData = async <TModel extends keyof PrismaClient>(
  selections: SelectionNode[],
  queryField: string,
  contextModel: any,
  identifier: any,
  whereProperty: string,
  includeProperty: string
) => {
  if (
    selections.some(
      (selection) =>
        isFieldNode(selection) && selection.name.value === queryField
    )
  ) {
    return await contextModel.findMany({
      where: { [whereProperty]: identifier },
      include: { [includeProperty]: true },
    });
  }
};
