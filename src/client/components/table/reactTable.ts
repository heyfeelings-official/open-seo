/**
 * TanStack Table v9 moved the v8 call shape to `/legacy` (`useLegacyTable`,
 * `legacyCreateColumnHelper`). Column definitions across the app still use
 * that shape. This module is the only import site, so a later move to
 * `useTable` + `tableFeatures` stays in one place.
 */
export type { RowData } from "@tanstack/react-table";

export {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  legacyCreateColumnHelper as createColumnHelper,
  useLegacyTable as useReactTable,
  type LegacyColumnDef as ColumnDef,
  type LegacyHeader as Header,
  type LegacyRow as Row,
  type LegacyTable as Table,
  type LegacyTableOptions as TableOptions,
} from "@tanstack/react-table/legacy";

export {
  flexRender,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
