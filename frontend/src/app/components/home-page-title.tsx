import Image from 'next/image'
import Link from 'next/link'
import { AnchorHTMLAttributes, FC } from 'react'

import githubIcon from 'public/icons/github-button.svg'
import acurastLogo from 'public/images/acurast-logo.png'
import inkathonLogo from 'public/images/inkathon-logo.png'

import { cn } from '@/utils/cn'

interface StyledIconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  className?: string
}

const StyledIconLink: React.FC<StyledIconLinkProps> = ({ className, children, ...rest }) => (
  <Link
    className={cn(
      'group opacity-90 transition-all hover:-translate-y-0.5 hover:opacity-100',
      className,
    )}
    {...rest}
  >
    {children}
  </Link>
)

export const HomePageTitle: FC = () => {
  const title = 'Acurast ink!athon dApp'
  const desc = 'Full-Stack DApp integrating Acurast in ink!athon'
  const githubHref = 'https://github.com/arjanjohan/inkathon-acurast-hackathon-project'

  return (
    <>
      <div className="flex flex-col items-center text-center font-mono">
        {/* Logo & Title */}
        <Link
          href={githubHref}
          target="_blank"
          // className="group"
          className="group flex cursor-pointer items-center gap-4 rounded-3xl px-3.5 py-1.5 transition-all hover:bg-gray-900"
        >
          <Image src={acurastLogo} priority width={60} alt="Acurast Logo" />
          <h1 className="text-[2.5rem] font-black tracking-tighter">{title}</h1>
          <Image src={inkathonLogo} priority width={60} alt="ink!athon Logo" />
        </Link>

        {/* Tagline & Lincks */}
        <p className="mb-2 mt-4 text-gray-400">{desc}</p>
        <p className="mb-8 text-xs text-gray-600">
          Built by{' '}
          <a
            href="https://twitter.com/arjanjohan/"
            target="_blank"
            className="font-semibold text-gray-600 hover:text-gray-300"
          >
            arjanjohan
          </a>{' '}
          for Encode x Polkadot Hackathon 2024.
        </p>

        {/* Github & Vercel Buttons */}
        <div className="flex select-none space-x-2">
          <StyledIconLink href={githubHref} target="_blank">
            <Image src={githubIcon} priority height={32} alt="Github Repository" />
          </StyledIconLink>
        </div>

        <div className="my-14 h-[1px] w-[5rem] max-w-full bg-gray-800" />
      </div>
    </>
  )
}
