import ReportCreate from 'justdone-system-package/dest/app/model/report/ReportCreate';

export default function getReports(): {isRequired: boolean, data: ReportCreate}[] {
    return [
        {isRequired: false, data: <ReportCreate>{name: 'Test 1'}},
    ];
}
