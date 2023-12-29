import { Link } from 'react-router-dom'
import { P, H6 } from '@components/text'
import { getColor } from '@conf/utils'
import { RouteConst } from '@conf/const'

const ArchiveBanner = () => {
    return(
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 10,
            background: getColor("yellow")
        }}>
            <H6 style={{
                fontWeight: "fontWeightBold"
            }}>MyFxTracker is no longer active</H6>
            <P>This is an archived version of the site</P>
            <Link
                to={`/${RouteConst.ARCHIVE_INFO_ROUTE}`}
                style={{
                    color: getColor("dark")
                }}>
                    Details here
            </Link>
        </div>
    )
}

export default ArchiveBanner