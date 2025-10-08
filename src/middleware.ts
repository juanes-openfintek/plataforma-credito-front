import { stackMiddlewares } from './middlewares/stackHandler'
import { userMiddleware } from './middlewares/userMiddleware'
import { adminMiddleware } from './middlewares/adminMiddleware'
import { approverMiddleware } from './middlewares/approverMiddleware'
import { disburserMiddleware } from './middlewares/disburserMiddleware'

const middlewares = [userMiddleware, approverMiddleware, disburserMiddleware, adminMiddleware]
export default stackMiddlewares(middlewares)
