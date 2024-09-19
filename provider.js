// SPDX-License-Identifier: WTFPL

async function scheduleHtmlProvider() {
    await loadTool("AIScheduleTools");
    const semesterCodeURL = "https://yjspt.xidian.edu.cn/gsapp/sys/wdkbapp/modules/xskcb/kfdxnxqcx.do";
    const classInfoURL = "https://yjspt.xidian.edu.cn/gsapp/sys/wdkbapp/modules/xskcb/xspkjgcx.do";
    try{

        const wid = await fetch(semesterCodeURL, {method: "POST"}).then(response => response.json()).then(data => data.datas.kfdxnxqcx.rows[0].WID);

        let searchParams = new URLSearchParams();
        searchParams.append('XNXQDM', wid);
        const classInfo = await fetch(classInfoURL, {method: "POST", body: searchParams},).then(response => response.json()).then(data => data.datas.xspkjgcx.rows);

        let dealtClass = [];
        classInfo.forEach(function (i) {
            let toPush = {};
            toPush.position = i['JASMC'];
            toPush.name = i['KCMC'];
            toPush.teacher = i['JSXM'];
            toPush.day = i['XQ'];
            toPush.section = [i['JSJCDM']];
            toPush.weeks = [];
            for (const index in i['ZCBH']) {
                if (i['ZCBH'][index] == '1')
                    toPush.week.push(number(index) + 1);
            }

            dealtClass.push(toPush);
        });
        return JSON.stringify({
            semesterCode: wid,
            classinfo: dealtClass
        })
    } catch (error){
        console.error(error)
        await AIScheduleAlert("页面错误, 请打开我的课表")
        return 'do not continue'
    }
}
