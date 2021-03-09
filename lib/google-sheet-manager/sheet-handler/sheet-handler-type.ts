export type TSheetRow<T> = Omit<T, 'save' | 'delete' | 'rowIndex' | 'a1Range'>;
