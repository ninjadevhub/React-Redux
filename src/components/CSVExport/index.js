import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const convertSpecialChar = (src) => {
  if (!src) {
    return '';
  }
  src.toString().replace(/"/g, '\'');
  return src;
};

const convertToCSV = (args) => {
  const data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  const columnWrapper = args.columnWrapper || '"';
  const columnDelimiter = args.columnDelimiter || ',';
  const lineDelimiter = args.lineDelimiter || '\n';

  const keys = Object.keys(data[0]);

  let result = '';
  // result += keys.join(columnDelimiter)
  // result += lineDelimiter

  data.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += columnWrapper + convertSpecialChar(item[key]) + columnWrapper;
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

export const downloadCSV = (csvData, csvFileName) => {
  const csv = convertToCSV({
    data: csvData,
  });
  if (csv == null) return;

  // if (!csv.match(/^data:text\/csv/i)) {
  //  csv = 'data:text/csv;charset=utf-8,' + csv;
  // }
  // data = encodeURI(csv);
  const blob = new Blob([csv], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', csvUrl);
  link.setAttribute('download', csvFileName);
  link.click();
};

export const CSVExport = (props) => (
  <Button {...props}>
    <img src="/icons/download.svg" alt="Export" />
    {
      props.isTextVisible && <span className="d-none d-md-inline ml-1">Export</span>
    }
  </Button>
);

CSVExport.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  isTextVisible: PropTypes.bool,
};

CSVExport.defaultProps = {
  className: '',
  title: 'CSV Export',
  isLoading: false,
  isDisabled: false,
  onClick: () => {},
  isTextVisible: true,
};

export default CSVExport;
