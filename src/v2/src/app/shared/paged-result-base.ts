export abstract class PagedResultBase {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;

  public get firstRowOnPage(): number {
    return (this.currentPage - 1) * this.pageSize + 1
  }

  public get lastRowOnPage(): number {
    return Math.min(this.currentPage * this.pageSize, this.rowCount);
  }

}
