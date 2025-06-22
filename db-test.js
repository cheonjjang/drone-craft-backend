const mongoose = require('mongoose');

// Vercel 환경 변수에서 MONGO_URI를 가져옵니다.
// 환경 변수가 설정되지 않은 경우를 대비해 기본값도 설정할 수 있지만,
// 여기서는 Vercel 배포 환경에서의 테스트가 목적이므로 필수입니다.
const mongoURI = process.env.MONGO_URI;

console.log('--- 데이터베이스 연결 테스트 시작 ---');
console.log(`사용할 MONGO_URI: ${mongoURI ? '설정됨' : '설정되지 않음. Vercel 환경변수를 확인하세요.'}`);
if (!mongoURI) {
  console.error('MONGO_URI 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 확인해주세요.');
  process.exit(1); // 환경 변수가 없으면 테스트 종료
}

async function connectToDatabase() {
  try {
    console.log('mongoose.connect를 호출합니다...');
    
    // Mongoose가 연결을 시도하고 완료될 때까지 기다립니다.
    // 타임아웃을 넉넉하게 30초로 설정합니다.
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 30000 });
    
    console.log('✅ 성공! MongoDB에 성공적으로 연결되었습니다.');
    
    // 연결 성공 후, 정상적으로 프로세스를 종료합니다.
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    // 연결 실패 시, 에러의 모든 정보를 최대한 자세하게 출력합니다.
    console.error('❌ 실패! MongoDB 연결 중 심각한 오류가 발생했습니다.');
    console.error('--- 에러 객체 전체 내용 ---');
    console.error(error);
    console.error('--- 에러 이름 ---');
    console.error(`Error Name: ${error.name}`);
    console.error('--- 에러 메시지 ---');
    console.error(`Error Message: ${error.message}`);
    if (error.reason) {
      console.error('--- 실패 원인 (Reason) ---');
      console.error(error.reason);
    }
    
    // 에러 발생 시, 비정상 종료 코드로 프로세스를 끝냅니다.
    process.exit(1);
  }
}

// 테스트 함수 실행
connectToDatabase(); 