import React from 'react'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/th'

import {
  DataGrid,
  GridColDef,
  bgBG,
  GridRenderCellParams,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles'

import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
} from '@material-ui/icons'
import { green, red } from '@material-ui/core/colors'

import * as actions from '../actions'
import { getCookie } from 'utils/cookies'
import { isLoginAsAdmin } from 'utils/isLogin'

const ODD_OPACITY = 0.1
moment.locale('th')

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[100],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}))

const theme = createTheme(
  {
    typography: {
      fontFamily: ['Prompt', 'sans-serif'].join(','),
    },
    palette: {
      primary: { main: process.env.REACT_APP_SECONDARY_COLOR_HEX },
      secondary: { main: process.env.REACT_APP_PRIMARY_COLOR_HEX },
    },
  },
  bgBG
)

interface GridCellExpandProps {
  value: string
  width: number
}

function isOverflown(element: Element): boolean {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  )
}

const GridCellExpand = React.memo(function GridCellExpand(
  props: GridCellExpandProps
) {
  const { width, value } = props
  const wrapper = React.useRef<HTMLDivElement | null>(null)
  const cellDiv = React.useRef(null)
  const cellValue = React.useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [showFullCell, setShowFullCell] = React.useState(false)
  const [showPopper, setShowPopper] = React.useState(false)

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!)
    setShowPopper(isCurrentlyOverflown)
    setAnchorEl(cellDiv.current)
    setShowFullCell(true)
  }

  const handleMouseLeave = () => {
    setShowFullCell(false)
  }

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowFullCell, showFullCell])

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
          >
            <Typography variant='body2' style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  )
})

const renderDateValue = (params: any) => {
  if (params.value === null) return '-'
  return moment(params.value).add(543, 'year').format('ll')
}

const renderStatusCell = (params: any, fieldName: string) => {
  const flag = get(params, `row.${fieldName}Flag`, false)

  return (
    <Stack direction='row' alignItems='center'>
      {flag === 'ผ่าน' ? (
        <Tooltip title='ผ่าน'>
          <CheckIcon
            style={{
              color: green[800],
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title='ไม่ผ่าน'>
          <CancelIcon
            style={{
              color: red[800],
            }}
          />
        </Tooltip>
      )}
    </Stack>
  )
}

function renderCellExpand(params: GridRenderCellParams<string>) {
  return (
    <GridCellExpand
      value={params.value || ''}
      width={params.colDef.computedWidth}
    />
  )
}

export default function Table({
  tableData,
  loading,
  currentDepartmentLabel,
}: any) {
  const dispatch = useDispatch()

  const requestRowUpdate = (citizenId: string, name: string) => {
    const load_row_data_action = actions.loadRowData(String(citizenId), name)
    dispatch(load_row_data_action)
  }

  function CustomToolbar() {
    const isAdmin = isLoginAsAdmin()
    const departmentName = getCookie('departmentName')

    return (
      <GridToolbarContainer
        sx={{
          paddingLeft: '6px',
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <GridToolbarColumnsButton />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarFilterButton />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarDensitySelector />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarExport
            printOptions={{ disableToolbarButton: true }}
            csvOptions={{
              delimiter: ',',
              utf8WithBom: true,
              fileName: `รายงานผลการพัฒนาฯ - ${
                isAdmin ? currentDepartmentLabel : departmentName
              }`,
            }}
          />
        </Stack>
      </GridToolbarContainer>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'order',
      headerName: 'ลำดับ',
      width: 60,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'title',
      headerName: 'คำนำหน้าชื่อ',
      headerAlign: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            คำนำ
            <br />
            หน้าชื่อ
          </Typography>
        )
      },
      width: 80,
      renderCell: renderCellExpand,
    },
    {
      field: 'firstName',
      headerName: 'ชื่อ',
      headerAlign: 'center',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'lastName',
      headerName: 'นามสกุล',
      headerAlign: 'center',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'jobStartDate',
      headerName: 'วันที่รับราชการ',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            วันที่รับ
            <br />
            ราชการ
          </Typography>
        )
      },
      minWidth: 120,
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        }
        return moment(params.value).add(543, 'year').format('ll')
      },
    },
    {
      field: 'jobType',
      headerName: 'ประเภทตำแหน่ง',
      headerAlign: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            ประเภท
            <br />
            ตำแหน่ง
          </Typography>
        )
      },
      minWidth: 100,
      renderCell: renderCellExpand,
    },
    {
      field: 'jobLevel',
      headerName: 'ระดับตำแหน่ง',
      headerAlign: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            ระดับ
            <br />
            ตำแหน่ง
          </Typography>
        )
      },
      minWidth: 100,
      renderCell: renderCellExpand,
    },
    {
      field: 'jobTitle',
      headerName: 'ตำแหน่ง',
      headerAlign: 'center',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'ministry',
      headerName: 'กระทรวง',
      headerAlign: 'center',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'department',
      headerName: 'กรม',
      headerAlign: 'center',
      minWidth: 120,
      renderCell: renderCellExpand,
    },
    {
      field: 'orientationFlag',
      headerName: 'ปฐมนิเทศ',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            ปฐมนิเทศ
          </Typography>
        )
      },
      minWidth: 100,
      renderCell: (params) => renderStatusCell(params, 'orientation'),
    },
    {
      field: 'orientationDate',
      headerName: 'วันที่ผ่านปฐมนิเทศ',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            วันที่ผ่าน
            <br />
            ปฐมนิเทศ
          </Typography>
        )
      },
      minWidth: 120,
      valueFormatter: (params) => renderDateValue(params),
    },
    {
      field: 'eLearningFlag',
      headerName: 'หลักสูตร ขรก ใหม่',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            หลักสูตร
            <br />
            ขรก ใหม่
          </Typography>
        )
      },
      minWidth: 120,
      renderCell: (params) => renderStatusCell(params, 'eLearning'),
    },
    {
      field: 'eLearningDate',
      headerName: 'วันที่ผ่านหลักสูตร',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            วันที่ผ่าน
            <br />
            หลักสูตรฯ
          </Typography>
        )
      },
      minWidth: 120,
      valueFormatter: (params) => renderDateValue(params),
    },
    {
      field: 'jointTrainingFlag',
      headerName: 'อบรมสัมมนาร่วมกัน',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            อบรม
            <br />
            สัมมนาร่วมกัน
          </Typography>
        )
      },
      minWidth: 120,
      renderCell: (params) => renderStatusCell(params, 'jointTraining'),
    },
    {
      field: 'jointTrainingDate',
      headerName: 'วันที่ผ่านอบรม',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            วันที่
            <br />
            ผ่านอบรม
          </Typography>
        )
      },
      minWidth: 120,
      valueFormatter: (params) => renderDateValue(params),
    },
    {
      field: 'lastUpdate',
      headerName: 'วันเวลาที่อัพเดตข้อมูล',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            วันเวลาที่
            <br />
            อัพเดตข้อมูล
          </Typography>
        )
      },
      minWidth: 160,
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        }
        const text = moment(params.value).add(543, 'year').format('lll')
        return `${text.replaceAll(' เวลา', '')} น.`
      },
    },
    {
      field: 'action',
      headerName: 'อัพเดตข้อมูล',
      minWidth: 80,
      disableColumnMenu: true,
      disableReorder: true,
      disableExport: true,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => {
        return (
          <Typography
            align='center'
            sx={{ fontWeight: 500, fontSize: 14, lineHeight: '1.1' }}
          >
            อัพเดต
            <br />
            ข้อมูล
          </Typography>
        )
      },
      renderCell: (params) => {
        const name = `${params.row.title} ${params.row.firstName} ${params.row.lastName}`
        return (
          <IconButton
            size='small'
            onClick={() => requestRowUpdate(params.row.id, name)}
          >
            <ReplayIcon />
          </IconButton>
        )
      },
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minHeight: 500 }}>
        <StripedDataGrid
          autoHeight
          loading={loading}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          rows={tableData}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          disableSelectionOnClick
          localeText={{
            // Root
            noRowsLabel: 'ไม่มีข้อมูล',
            noResultsOverlayLabel: 'ไม่พบผลลัพธ์',
            errorOverlayDefaultLabel: 'เกิดข้อผิดพลาดบางอย่าง',

            // Density selector toolbar button text
            toolbarDensity: 'ขนาดของแถว',
            toolbarDensityLabel: 'ขนาดของแถว',
            toolbarDensityCompact: 'กะทัดรัด',
            toolbarDensityStandard: 'มาตรฐาน',
            toolbarDensityComfortable: 'สบายตา',

            // Columns selector toolbar button text
            toolbarColumns: 'จัดการคอลัมน์',
            toolbarColumnsLabel: 'เลือกคอลัมน์',

            // Filters toolbar button text
            toolbarFilters: 'ตัวกรอง',
            toolbarFiltersLabel: 'แสดงตัวกรอง',
            toolbarFiltersTooltipHide: 'ซ่อนตัวกรอง',
            toolbarFiltersTooltipShow: 'แสดงตัวกรอง',
            toolbarFiltersTooltipActive: (count) =>
              count !== 1
                ? `${count} ตัวกรองที่ใช้อยู่`
                : `${count} ตัวกรองที่ใช้อยู่`,

            // Quick filter toolbar field
            toolbarQuickFilterPlaceholder: 'ค้นหา...',
            toolbarQuickFilterLabel: 'ค้นหา',
            toolbarQuickFilterDeleteIconLabel: 'ล้าง',

            // Export selector toolbar button text
            toolbarExport: 'นำออก',
            toolbarExportLabel: 'นำออก',
            toolbarExportCSV: 'นำออกเป็นไฟล์ CSV',
            toolbarExportPrint: 'สั่งพิมพ์',
            toolbarExportExcel: 'นำออกเป็นไฟล์ Excel',

            // Columns panel text
            columnsPanelTextFieldLabel: 'ค้นหาคอลัมน์',
            columnsPanelTextFieldPlaceholder: 'ชื่อคอลัมน์',
            columnsPanelDragIconLabel: 'Reorder column',
            columnsPanelShowAllButton: 'แสดงทั้งหมด',
            columnsPanelHideAllButton: 'ซ่อนทั้งหมด',

            // Filter panel text
            filterPanelAddFilter: 'เพิ่มตัวกรอง',
            filterPanelDeleteIconLabel: 'ลบ',
            filterPanelLinkOperator: 'เงื่อนไข',
            filterPanelOperators: 'เงื่อนไข', // TODO v6: rename to filterPanelOperator
            filterPanelOperatorAnd: 'และ',
            filterPanelOperatorOr: 'หรือ',
            filterPanelColumns: 'คอลัมน์',
            filterPanelInputLabel: 'คำค้นหา',
            filterPanelInputPlaceholder: 'คำค้นหา',

            // Filter operators text
            filterOperatorContains: 'ประกอบด้วย',
            filterOperatorEquals: 'เท่ากับ',
            filterOperatorStartsWith: 'เริ่มต้นด้วย',
            filterOperatorEndsWith: 'ลงท้ายด้วย',
            filterOperatorIs: 'มีค่าเป็น',
            filterOperatorNot: 'ไม่ได้มีค่าเป็น',
            filterOperatorAfter: 'อยู่ถัดจาก',
            filterOperatorOnOrAfter: 'อยู่เท่ากับ หรือ ถัดจาก',
            filterOperatorBefore: 'อยู่ก่อนหน้า',
            filterOperatorOnOrBefore: 'อยู่เท่ากับ หรือ ก่อนหน้า',
            filterOperatorIsEmpty: 'ไม่มีค่า',
            filterOperatorIsNotEmpty: 'มีค่า',
            filterOperatorIsAnyOf: 'เป็นหนึ่งใน',

            // Filter values text
            filterValueAny: 'ใดๆ',
            filterValueTrue: 'ถูก',
            filterValueFalse: 'ผิด',

            // Column menu text
            columnMenuLabel: 'เมนู',
            columnMenuShowColumns: 'จัดการคอลัมน์',
            columnMenuFilter: 'ตัวกรอง',
            columnMenuHideColumn: 'ซ่อน',
            columnMenuUnsort: 'เลิกเรียงลำดับ',
            columnMenuSortAsc: 'เรียงน้อยไปมาก',
            columnMenuSortDesc: 'เรียงมากไปน้อย',

            // Column header text
            columnHeaderFiltersTooltipActive: (count) =>
              count !== 1
                ? `${count} ตัวกรองที่ใช้อยู่`
                : `${count} ตัวกรองที่ใช้อยู่`,
            columnHeaderFiltersLabel: 'แสดงตัวกรอง',
            columnHeaderSortIconLabel: 'เรียงลำดับ',

            // Rows selected footer text
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} แถวถูกเลือก`
                : `${count.toLocaleString()} แถวถูกเลือก`,

            // Total row amount footer text
            footerTotalRows: 'จำนวนแถวทั้งหมด',

            // Total visible row amount footer text
            footerTotalVisibleRows: (visibleCount, totalCount) =>
              `${visibleCount.toLocaleString()} จาก ${totalCount.toLocaleString()}`,

            // Checkbox selection text
            checkboxSelectionHeaderName: 'Checkbox selection',
            checkboxSelectionSelectAllRows: 'Select all rows',
            checkboxSelectionUnselectAllRows: 'Unselect all rows',
            checkboxSelectionSelectRow: 'Select row',
            checkboxSelectionUnselectRow: 'Unselect row',

            // Boolean cell text
            booleanCellTrueLabel: 'yes',
            booleanCellFalseLabel: 'no',

            // Actions cell more text
            actionsCellMore: 'more',

            // Column pinning text
            pinToLeft: 'Pin to left',
            pinToRight: 'Pin to right',
            unpin: 'Unpin',

            // Tree Data
            treeDataGroupingHeaderName: 'Group',
            treeDataExpand: 'see children',
            treeDataCollapse: 'hide children',

            // Grouping columns
            groupingColumnHeaderName: 'Group',
            groupColumn: (name) => `Group by ${name}`,
            unGroupColumn: (name) => `Stop grouping by ${name}`,

            // Master/detail
            expandDetailPanel: 'Expand',
            collapseDetailPanel: 'Collapse',

            // Used core components translation keys
            MuiTablePagination: {
              labelRowsPerPage: 'จำนวนแถวต่อหน้า',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} จาก ${count}`,
            },

            // Row reordering text
            rowReorderingHeaderName: 'Row reordering',
          }}
        />
      </div>
    </ThemeProvider>
  )
}
