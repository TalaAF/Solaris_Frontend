import React from "react";
import "./table.css";

const Table = React.forwardRef(({ className = "", ...props }, ref) => (
  <div className="solaris-table-container">
    <table
      ref={ref}
      className={`solaris-table ${className}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <thead ref={ref} className={`solaris-table-header ${className}`} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={`solaris-table-body ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className = "", ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`solaris-table-footer ${className}`}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={`solaris-table-row ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`solaris-table-head ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className = "", ...props }, ref) => (
  <td
    ref={ref}
    className={`solaris-table-cell ${className}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className = "", ...props }, ref) => (
  <caption
    ref={ref}
    className={`solaris-table-caption ${className}`}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Make sure to export all components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};