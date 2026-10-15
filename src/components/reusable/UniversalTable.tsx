import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

type DataKey<T extends object> = Extract<keyof T, string>;

export interface UniversalTableHeader<T extends object> {
  key: DataKey<T>;
  value: string;
}

export interface UniversalTableRow<T extends object> {
  key: DataKey<T>;
  component: (item: T) => JSX.Element;
}

export interface UniversalTableAction<T extends object> {
  key: string;
  value: string;
  onPresss: (item: T) => void;
  hidden?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
}

export interface UniversalTableProps<T extends object> {
  header: UniversalTableHeader<T>[];
  rows: UniversalTableRow<T>[];
  action?: UniversalTableAction<T>[];
  data: T[];
  isLoading?: boolean;
}

interface OpenActionMenu {
  rowIndex: number;
  top: number;
  left: number;
}

const ACTION_MENU_WIDTH = 208;

export default function UniversalTable<T extends object>({
  header,
  rows,
  action,
  data,
  isLoading = false,
}: UniversalTableProps<T>) {
  const [openActionMenu, setOpenActionMenu] =
    useState<OpenActionMenu | null>(null);

  const rowRenderers = useMemo(
    () => new Map(rows.map((row) => [row.key, row.component])),
    [rows],
  );

  const hasActions = Boolean(action?.length);

  useEffect(() => {
    if (!openActionMenu) return;

    const closeMenu = () => setOpenActionMenu(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openActionMenu]);

  const handleActionMenuToggle = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowIndex: number,
  ) => {
    if (openActionMenu?.rowIndex === rowIndex) {
      setOpenActionMenu(null);
      return;
    }

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const left = Math.max(
      8,
      Math.min(
        buttonRect.right - ACTION_MENU_WIDTH,
        window.innerWidth - ACTION_MENU_WIDTH - 8,
      ),
    );

    setOpenActionMenu({
      rowIndex,
      top: buttonRect.bottom + 8,
      left,
    });
  };

  const actionMenu =
    hasActions && !isLoading && openActionMenu && action
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close actions menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpenActionMenu(null)}
            />
            <div
              role="menu"
              className="fixed z-50 w-52 overflow-hidden rounded-xl border border-secondary-200 bg-white py-1 shadow-xl dark:border-secondary-700 dark:bg-secondary-800"
              style={{
                top: openActionMenu.top,
                left: openActionMenu.left,
              }}
            >
              {action
                .filter(
                  (itemAction) =>
                    !itemAction.hidden?.(data[openActionMenu.rowIndex]),
                )
                .map((itemAction) => {
                  const selectedItem = data[openActionMenu.rowIndex];
                  const isDisabled =
                    itemAction.disabled?.(selectedItem) ?? false;

                  return (
                    <button
                      key={itemAction.key}
                      type="button"
                      role="menuitem"
                      disabled={isDisabled}
                      onClick={() => {
                        itemAction.onPresss(selectedItem);
                        setOpenActionMenu(null);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-100 focus:bg-secondary-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:focus:bg-secondary-700"
                    >
                      {itemAction.value}
                    </button>
                  );
                })}
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white dark:border-secondary-700 dark:bg-secondary-800">
        <div className="overflow-x-auto">
          <table
            aria-busy={isLoading}
            className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700"
          >
            <thead className="bg-secondary-50 dark:bg-secondary-900">
              <tr>
                {header.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400"
                  >
                    {column.value}
                  </th>
                ))}
                {hasActions && (
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary-200 bg-white dark:divide-secondary-700 dark:bg-secondary-800">
              {isLoading &&
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={`loading-row-${rowIndex}`} className="animate-pulse">
                    {header.map((column, columnIndex) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 align-middle"
                      >
                        <div
                          className={`h-4 rounded bg-secondary-200 dark:bg-secondary-700 ${
                            columnIndex === 0
                              ? "w-40"
                              : columnIndex % 2 === 0
                                ? "w-24"
                                : "w-32"
                          }`}
                        />
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-6 py-4">
                        <div className="ml-auto h-8 w-8 rounded-lg bg-secondary-200 dark:bg-secondary-700" />
                      </td>
                    )}
                  </tr>
                ))}

              {!isLoading && data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700/60"
                >
                  {header.map((column) => {
                    const renderCell = rowRenderers.get(column.key);

                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 align-middle text-sm text-secondary-700 dark:text-secondary-200"
                      >
                        {renderCell ? (
                          renderCell(item)
                        ) : (
                          <span className="text-secondary-400">—</span>
                        )}
                      </td>
                    );
                  })}

                  {hasActions && (
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`Open actions for row ${rowIndex + 1}`}
                        aria-haspopup="menu"
                        aria-expanded={
                          openActionMenu?.rowIndex === rowIndex
                        }
                        onClick={(event) =>
                          handleActionMenuToggle(event, rowIndex)
                        }
                        className="rounded-lg p-2 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-secondary-700 dark:hover:text-secondary-200"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {!isLoading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={header.length + (hasActions ? 1 : 0)}
                    className="px-6 py-12 text-center text-sm text-secondary-500 dark:text-secondary-400"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {actionMenu}
    </>
  );
}