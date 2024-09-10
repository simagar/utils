export function useUtils() {

    function copyClipboard(text: string): void {
        navigator.clipboard.writeText(text)
    }

    function isArray(data: unknown): boolean {
        return Array.isArray(data)
    }

    function convertNumbers2English(str: string): string | undefined {
        if (str) {
            // @ts-ignore
            return str.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c: string): string | number {
                return c.charCodeAt(0) & 0xf;
            });
        }
    }

    function generateAnyFormData(data: any) {
        const formData = new FormData()

        Object.keys(data).forEach((key: string) => {
            if (data && data[key]) {
                if (!isArray(data[key])) {
                    if (typeof data[key] === 'object') {
                        Object.keys(data[key]).forEach((objKey) => {
                            formData.append(`${key}.${objKey}`, data[key][objKey])
                        })
                    } else {
                        formData.append(key, data[key])
                    }
                } else if (isArray(data[key])) {
                    data[key].forEach((arrayItem: any, index: number) => {
                        if (typeof arrayItem == 'object') {
                            Object.keys(arrayItem).forEach(innerKey => {
                                formData.append(`${key}[${index}].${innerKey}`, arrayItem[innerKey])
                            })
                        } else {
                            formData.append(`${key}[${index}]`, arrayItem)
                        }
                    })
                }
            }
        })
        return formData
    }

    function makeBase64(data: object | any): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = () => {
                // @ts-ignore
                resolve(fr?.result?.split(",")[1]);
            }
            fr.readAsDataURL(data);
        });
    }

    function logFormData(myFormData: FormData): void {
        for (let pair of myFormData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
    }

    function time_ago(time: string | number): string | number {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                // @ts-ignore
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        let time_formats = [
            [60, 'ثانیه ', 1], // 60
            [120, '1 دقیقه پیش', 'یک دقیقه پیش'], // 60*2
            [3600, 'دقیقه ', 60], // 60*60, 60
            [7200, '1 ساعت پیش', '1 ساعت پیش'], // 60*60*2
            [86400, 'ساعت ', 3600], // 60*60*24, 60*60
            [172800, 'دیروز', 'فردا'], // 60*60*24*2
            [604800, 'روز ', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'هفته پیش', 'هفته بعد'], // 60*60*24*7*4*2
            [2419200, 'هفته', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'ماه پیش', 'ماه بعد'], // 60*60*24*7*4*2
            [29030400, 'ماه', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'سال پیش', 'سال بعد'], // 60*60*24*7*4*12*2
            [2903040000, 'سال', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12

        ];
        // @ts-ignore
        let seconds = (+new Date() - time) / 1000,
            token = 'پیش',
            list_choice = 1;

        if (seconds == 0) {
            return 'پیش'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'پیش';
            list_choice = 2;
        }
        let i = 0,
            format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    function getTotalPages(totalCount: number, perPage: number): number {
        let totalPages = [];
        const result = Math.ceil(totalCount / perPage)
        for (let i = 1; i <= result; i++) {
            totalPages.push(i);
        }
        return totalPages.length
    }

    function dateToISOLikeButLocal(date: Date): string | Date {
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso.slice(0, 19);
        return isoLocal;
    }

    function addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000)
    }

    return {
        copyClipboard,
        isArray,
        makeBase64,
        time_ago,
        getTotalPages,
        convertNumbers2English,
        dateToISOLikeButLocal,
        addMinutes,
    }
}
