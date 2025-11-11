import CIcon from '@coreui/icons-react'
import {
  cilPuzzle,
  cilSpeedometer,
  cilCart,
  cilMoney,
  cilShortText,
  cilAddressBook,
  cilUser,
  cilPeople,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName='nav-icon' />,
  },

  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Categories',
    to: '/categories',
    icon: <CIcon icon={cilAddressBook} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Parent Category',
        to: '/category/parent',
      },
      {
        component: CNavItem,
        name: 'Child Category',
        to: '/category/child',
      },
      {
        component: CNavItem,
        name: 'Grandchild Category',
        to: '/category/grandchild',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Users Overview',
        to: '/users/overview',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Sellers',
    to: '/seller',
    icon: <CIcon icon={cilPeople} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'New Sellers',
        to: '/seller/new',
      },
      {
        component: CNavItem,
        name: 'Sellers Overview',
        to: '/seller/overview',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Promo Codes',
    to: '/promo',
    icon: <CIcon icon={cilShortText} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Employees',
    to: '/employees',
    icon: <CIcon icon={cilAddressBook} customClassName='nav-icon' />,
  },
  {
    component: CNavGroup,
    name: 'Products',
    to: '/product',
    icon: <CIcon icon={cilPuzzle} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Pending Products',
        to: '/product/pending',
        badge: {
          color: 'info',
        },
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/product/add',
      },
      {
        component: CNavItem,
        name: 'Products',
        to: '/product/products',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Orders',
    to: '/order',
    icon: <CIcon icon={cilCart} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Pending Orders',
        to: '/order/pendingOrders',
        badge: {
          color: 'info',
        },
      },
      {
        component: CNavItem,
        name: 'Orders Overview',
        to: '/order/overview',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Finance',
    to: '/finance',
    icon: <CIcon icon={cilMoney} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Statement',
        to: '/finance/statement',
      },
      {
        component: CNavItem,
        name: 'Amounts Summary',
        to: '/finance/summary',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'System Configuration',
    to: '/system',
    icon: <CIcon icon={cilSpeedometer} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Configuration Types',
        to: '/system/config/types',
      },
      {
        component: CNavItem,
        name: 'Configuration Values',
        to: '/system/config/values',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'System Log',
    to: '/log',
    icon: <CIcon icon={cilShortText} customClassName='nav-icon' />,
  },
]

export default _nav
