import { Fragment } from "react";

type Props = {
    children: JSX.Element
}

export default function Layout({ children } : Props) {
  return (
    <Fragment>
        <Fragment>
            {children}
        </Fragment>
    </Fragment>
  )
}
