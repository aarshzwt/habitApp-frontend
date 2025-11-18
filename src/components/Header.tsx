import Image from 'next/image'
import Link from 'next/link'
import {
    Repeat,
    MapPinPen,
    Trash2,
} from 'lucide-react'
import Router, { useRouter } from 'next/router'
import { Dropdown } from './Dropdown'
import { DropDownItem } from './types'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/slices/authSlice'

const Header = () => {
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    const items: DropDownItem[] = []
    const router = useRouter()
    const dispatch = useDispatch();
    if (router.pathname !== '/') {
        items.push({
            label: 'Home',
            icon: <Repeat className="w-4 h-4 text-blue-600" />,
            onClick: () => Router.push('/'),
        })
    }
    items.push(
        {
            label: 'My Habits',
            icon: <Repeat className="w-4 h-4 text-blue-600" />,
            onClick: () => Router.push('/habit')
        },
        {
            label: 'My Challenges',
            icon: <MapPinPen className="w-4 h-4 text-blue-600" />,
            onClick: () => Router.push('/myChallenges'),
        },
        {
            label: 'Explore Challenges',
            icon: <MapPinPen className="w-4 h-4 text-blue-600" />,
            onClick: () => Router.push('/challenge'),
        }
    )
    if (router.pathname !== '/login' && isLoggedIn) {
        items.push({
            label: 'Logout',
            icon: <Trash2 className="w-4 h-4 text-red-500" />,
            variant: 'danger',
            onClick: () => {
                dispatch(logout());
                Router.push('/login')
            },
        })
    }

    return (
        <header className="sticky top-0 z-50 py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" title="home" className="inline-flex items-center">
                    <Image
                        src="/images/logo.png"
                        height={60}
                        width={180}
                        className="object-contain"
                        alt="Logo"
                    />
                </Link>
                {router.pathname !== '/login' && (<Dropdown triggerLabel="Menu" items={items} />)}

            </div>
        </header>
    )
}

export default Header
