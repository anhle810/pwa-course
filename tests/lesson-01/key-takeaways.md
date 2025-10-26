# Section 2 - Lesson 01

## Environment 

- Dev: Dùng để dev, test, debug
- Staging: gần giống env thực tế
- Production: Env thực tế, end user dùng

### Cài thư viện dotenv

npm install -D dotenv  (cần vào playwright config để import dotenv)

=> Tạo file .env

KEY='vale'

### Cách truy xuất biến môi trường

Biến môi trường: giá trị động

process.env.ENV (ENV/BASE_URL/USER_NAME/PASSWORD)

- Nếu 1 máy chứ nhiều env khác nhau cần khai báo file .env riêng cho mỗi môi trường: 

.env.dev

.env.prod 

Note: file .env cần được đưa vào gitignore để không push lên github, tránh các vấn đề về security 


## Test management 

### Annotations: metadata thông tin bổ sung cho test hoặc điểu chỉnh test chạy 

- test.skip('skip test này', async ({ page }) => { }); 
Bỏ qua test này (chưa cần fix hoặc outdated)

- test.skip(process.env.ENV === 'prod', 'Không chạy trên prod');
Conditional skip: Bỏ qua test này khi gặp điều kiện này => VD: nếu là môi trường production thì bỏ qua test này 

- test.fixme("Assert number of product", async ({ page }) => { }); 
đánh dấu 1 test là bỏ qua (cần fix nhưng chưa có thời gian, đánh dấu để test không fail nữa)

- Thêm thông tin cho test

test("01 - annotation", {
    annotation: {
        type: 'lesson',
        description: 'lesson-01'
    }
}, async ({ page }, testInfo) => { // test content });

### Custom annotation

tag: ["@TEST-01", "@Login", "@smoke"] : mảng 
=> dùng như label để đánh dấu các test 

npx playwright test - g "smoke" 
=> chỉ chạy các test có tag "smoke 


## Emulation

Có thể giả lập:

#### Device: giả lập thiết bị => safari trên iphone 12 

import { defineConfig, devices } from '@playwright/test';

export default defineConfig ({

projects: [
    {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
    },
]
});



#### Viewport: giả lập viewport trong project
import { defineConfig, devices } from '@playwright/test';

export default defineConfig ({

projects: [
    {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
        viewport: { width: 1280, height: 720 },

    },
]
});




#### Locale & timezone: giả lập locale và timezone

import { defineConfig } from '@playwright/test';

export default defineConfig({

use: {
locale: 'en-GB',

timezoneId: 'Europe/Paris',
},
});

\
#### Permission: cam/mic/location
https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions 

Trong config

import { defineConfig } from '@playwright/test';

export default defineConfig({
use: {
// Grants specified permissions to the browser context.
permissions: ['notifications'],
},
});

- Trong test:

await browserContext.grantPermissions(permissions);

await browserContext.grantPermissions(permissions, options);

VD:

import { test } from '@playwright/test';
test.beforeEach(async ({ context }) => {
// Runs before each test and signs in each page.

context.grantPermissions(['notifications'], {
    origin: 'https://skype.com' });
});


## Clock: thay đổi hành vi của đồng hồ để phục vụ các test cần chờ

● setFixedTime() : dùng để đặt thời gian thành giá trị cố định cho các test cần tgian cố định, vd: banner của flashsale được hiển thị khi đến giờ 

await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));


● install() : khởi tạo đồng hồ => kiểm soát thời gian và timer, cần gọi trước tất cả các function khác (nhảy đến mốc tgian được set và chạy tiếp)

await page.clock.install({ time: new Date('2024-02-02T08:00:00') });



● fastForward() : tuan nhanh đến tương lai mà không phải đợi, test các case timeout hoặc session expire

await page.clock.fastForward(5000); // 5 giây



● pauseAt() : dừng lại tại thời điểm => kiểm tra (trạng thái, UI,...) tại thời điểm chính xác

await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));


● runFor() : tick thủ công để kiểm tra chi tiết thời gian vd payment pending, nhảy từng bước nhảy

await page.clock.runFor(2000); //tick 2 giây (nhảy từng bước 2s)


## Accessibility testing: test khả năng truy cập

- Tuân thủ pháp lý: Tránh kiện tụng
- Cải thiện UX: Làm web thân thiện hơn cho tất cả người dùng.
- Tăng phạm vi tiếp cận: Hỗ trợ người dùng với công nghệ hỗ trợ (screen readers, keyboard navigation).

Playwright tích hợp với axe-core để phát hiện tự động các vấn đề accessibility (57%) theo tiêu chuẩn WCAG (Web Content Accessibility Guidelines), còn lại cần test manual.

Các vấn đề mà axe-core có thể kiểm tra:

● Độ tương phản màu (Contrast)
● Labels cho trình đọc màn hình: Input thiếu label hoặc aria-label.
● ID trùng lặp: Phần tử có ID giống nhau gây nhầm lẫn cho assistive tech.
● Alt text cho image: Hình ảnh thiếu alt attribute mô tả.
● Keyboard navigation
● ARIA attributes: Sử dụng sai ARIA roles, states.

Câu lệnh cài axe-core 

npm install -D @axe-core/playwright