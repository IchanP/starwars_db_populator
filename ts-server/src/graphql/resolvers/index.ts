// Helper methods for resolving data

import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "../../context";
import { FieldNode, SelectionNode } from "graphql";
import { Selection } from "@prisma/client/runtime/library";

// Helper function to handle common logic
export const withContext = async (
  cxt: any,
  callback: (context: Context) => any
) => {
  const context = cxt as Context;
  return await callback(context);
};

export const isFieldNode = (selection: SelectionNode): selection is FieldNode =>
  selection.kind === "Field";

// NOTE - Not really sure how to type the context model...
/**
 * Fetches from the prisma context returning an array of the found item.
 *
 * @param {SelectionNode[]} selections - Array of field nodes to match with queryField.
 * @param {string} queryField - The query field that the selection must contain for the db search to execute.
 * @param {any} contextModel - The prisma context model, including the schema model to search in.
 * Example: context.prisma.starwars_film_characters .
 * @param {any} identifier - The identifier used to search the whereProperty column.
 * @param {string} whereProperty - The identifier field to search the table on. Like "id" or "transport_ptr_id".
 * @param {string} includeProperty - The prisma model to include in the return object. Can be null.
 * @returns {array<any>} - Returns an array of the objects or null.
 */
export const findManyData = async <TModel extends keyof PrismaClient>(
  selections: SelectionNode[],
  queryField: string,
  contextModel: any,
  identifier: any,
  whereProperty: string,
  includeProperty?: string
) => {
  if (isSelectionSome(queryField, selections)) {
    const query: any = makeQuery(identifier, whereProperty, includeProperty);
    return await contextModel.findMany(query);
  }
};

/**
 * Fetches a unique item from the context model.
 *
 * @param {SelectionNode[]} selections - Array of field nodes to match with queryField.
 * @param {string} queryField - The query field that the selection must contain for the db search to execute.
 * @param {any} contextModel - The prisma context model, including the schema model to search in.
 * Example: context.prisma.starwars_film_characters .
 * @param {any} identifier - The identifier used to search the whereProperty column.
 * @param {string} whereProperty - The identifier field to search the table on. Like "id" or "transport_ptr_id".
 * @param {string | null} includeProperty - The prisma model to include in the return object. Can be null.
 * @returns {object | null} - Returns the object or null.
 */
export const findUnique = (
  selections: SelectionNode[],
  queryField: string,
  contextModel: any,
  identifier: any,
  whereProperty: string,
  includeProperty?: string
) => {
  if (isSelectionSome(queryField, selections)) {
    const query: any = makeQuery(identifier, whereProperty, includeProperty);
    return contextModel.findUnique(query);
  }
};

export function isSelectionSome(
  queryField: string,
  selections: readonly SelectionNode[]
) {
  return selections.some(
    (selection) => isFieldNode(selection) && selection.name.value === queryField
  );
}
/**
 *
 * @param {any} context  The prisma context model.
 * Example: context.prisma.starwars_film_characters .
 * @param {any[]} itemArray - The array containing the the identifiers to find.
 * @param {string} itemProperty - The property to extract from the items in the itemArray.
 * @param {string} whereProperty - The property that needs to match the itemProperty.
 * @returns {any[]} - Returns an array containing the found items.
 */
export async function findManyIn(
  context: any,
  itemArray: any[],
  itemProperty: string,
  whereProperty: string
) {
  const findProperties = itemArray.map((item) => item[itemProperty]);
  return [
    ...(await context.findMany({
      where: { [whereProperty]: { in: findProperties } },
    })),
  ];
}

function makeQuery(
  identifier: any,
  whereProperty: string,
  includeProperty?: string
) {
  const query: any = {
    where: { [whereProperty]: identifier },
  };
  if (includeProperty) {
    query.include = { [includeProperty]: true };
  }
  return query;
}

export function findFieldNode(selection: SelectionNode[], nameValue: string) {
  return selection.find(
    (selection: SelectionNode): selection is FieldNode =>
      selection.kind === "Field" && selection.name.value === nameValue
  );
}
