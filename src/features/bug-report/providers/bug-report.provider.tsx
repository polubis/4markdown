import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { context } from 'development-kit/context';

const [BugReportProvider, useBugReportContext] = context(useSimpleFeature);

export { BugReportProvider, useBugReportContext };
