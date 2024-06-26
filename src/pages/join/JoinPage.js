// 프론트 박소연 담당
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  idOverlapPost,
  joinPost,
  nickOverlapPost,
} from "../../api/join/join_api";
import VerificationModal from "../../components/joinpopup/VerificationModal";
import Layout from "../../layouts/Layout";
import {
  CheckButton,
  Essential,
  FormGroup,
  InfoBox,
  InnerWrap,
  JoinButton,
  Wrap
} from "../../styles/join/JoinStyle";
import { ModalBackground } from "../../styles/login/LoginStyle";

const schema = yup
  .object({
    userId: yup
      .string()
      .min(2, "최소 5자 이상 작성해야 합니다.")
      .max(20, "최대 20자까지 작성 가능합니다.")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()]{5,20}$/,
        "아이디는 대소문자와 숫자를 포함해야 합니다."
      )
      .required("아이디를 입력해 주세요."),
    password: yup
      .string()
      .min(4, "최소 4자 이상 작성해야 합니다.")
      .max(20, "최대 20자까지 작성 가능합니다.")
      .matches(
        // /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{4,20}$/,
        /^(?=.*[a-zA-Z]?)(?=.*[0-9]?)(?=.*[!@#$%^&*()]?)[a-zA-Z0-9!@#$%^&*()]{4,20}$/,
        "비밀번호는 영어, 숫자, 특수문자만 가능합니다.",
      )
      .required("비밀번호를 입력해 주세요."),

    passwordCheck: yup
      .string()
      .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다")
      .required("비밀번호를 한번 더 입력해 주세요."),

    name: yup
      .string()
      .max(10, "최대 10자까지 작성 가능합니다.")
      .matches(
        /^[A-Za-z0-9가-힣]{0,10}$/,
        "이름은 영어, 한글만 가능합니다.",
      )
      .required(),

    nickname: yup
      .string()
      .min(2, "최소 2자 이상 작성해야 합니다.")
      .max(10, "최대 10자까지 작성 가능합니다.")
      .matches(
        /^[A-Za-z0-9가-힣]{2,10}$/,
        "닉네임은 영어, 한글, 숫자만 가능합니다.",
      )
      .required(),

    phone: yup
      .string()
      .matches(
        /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/,
        "번호를 정확히 입력해 주세요.",
      ),
  })
  .required();

const JoinPage = formState => {
  const [isValid, setIsValid] = useState(false);
  const [idConfirm, setIdConfirm] = useState(false);
  const [nickConfirm, setNickConfirm] = useState(false);
  // 본인 인증 버튼
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [resultOk, setResultOk] = useState(false);
  const [verifiData, setVerifiData] = useState();
  const [verifiResultModal, setVerifiResultModal] = useState(false);

  const verifiResultonConfirm = () => {
    setVerifiResultModal(true);
  };

  const verifiResultClose = () => {
    setVerifiResultModal(false);
  };

  const verificationConfirm = () => {
    setVerificationModal(true);
  };
  const closeVerificationModal = () => {
    setVerificationModal(false);
  };

  const onVerifiConfirm = async id => {
    try {
      let result;
      result = await idOverlapPost(id);

      if (result) {
        setVerifiData(result);
        setVerificationModal(false);
        setResultOk(true);
      } else {
        console.log("Result is empty");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const userId = watch("userId");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const name = watch("name");
  const nickname = watch("nickname");
  const phone = watch("phone");
  // const [isValid, setIsValid] = useState(0);
  const [catchErr, setCatchErr] = useState(false);

// 입력 필드의 변경 여부를 감지하기 위한 useEffect 사용
useEffect(() => {
  // 필수 입력 칸이 모두 채워져 있는지 확인
  if (!userId || !password || !passwordCheck || !name || !nickname || !phone) {
    setIsValid(false); // 필수 입력 칸이 하나라도 비어있으면 isValid를 false로 설정
  } else {
    setIsValid(true); // 모든 필수 입력 칸이 채워져 있으면 isValid를 true로 설정
  }

  // 에러 메시지 초기화
  setCatchErr(false);
}, [userId, password, passwordCheck, name, nickname, phone, errors]);


  // const verificationConfirm = () => {
  //   setVerificationModal(true);
  // };

  // 비밀번호나 전화번호에 대해서도 동일하게 처리할 수 있음
  const idPostSuccess = () => {
    // alert("성공");
  };

  const nickPostSuccess = () => {
    // alert("성공");
  };

  // const idPostFail = () => {
  //   alert("실패");
  // };

  const idOverlap = () => {
    const obj = {
      userId: userId,
    };
    idOverlapPost(
      obj,
      () => {
        setIsValid(2);
        idPostSuccess();
      }
    );
  };

  const idNullBt = () => {
    alert("아이디를 입력해주세요.");
  };

  const idOverlapBt = async e => {
    e.preventDefault();
    const res = await idOverlapPost({
      userId: userId,
    });
    if (res.data === "중복된 아이디입니다") {
      alert("이미 사용 중인 아이디입니다.");
    } else if (res.data === "사용가능한 아이디 입니다") {
      alert("사용 가능한 아이디입니다.");
    }
  };

  const nickNameOverlap = () => {
    const obj = {
      nickname: nickname,
    };
    nickOverlapPost(
      obj,
      () => {
        setIsValid(2);
        nickPostSuccess();
      }
    );
  };

  const nickNameNullBt = () => {
    alert("닉네임을 입력해주세요.");
  };

  const nickNameOverlapBt = async e => {
    e.preventDefault();
    const res = await nickOverlapPost({
      nickname: nickname,
    });
    if (!res) {
      alert("이미 사용 중인 닉네임입니다.");
    } else if (res.status === 200) {
      alert("사용 가능한 닉네임입니다.");
    }
  };

  // 가입하기 데이터 연동 부분
  const joinPostSuccess = () => {
    // alert("회원가입에 성공하였습니다.")
  };


  const joinNullBt = () => {
    alert("필수입력칸을 채워주세요.");
  };

  const joinSuccessBt = async e => {
    e.preventDefault();
    const res = await joinPost({
      userId: userId,
      password: password,
      passwordCheck: passwordCheck,
      name: name,
      nickname: nickname,
      phone: phone,
    });
    console.log(res);
    if (res.status === 400) {
      alert("휴대폰 번호 중복입니다.");
    } else if (res.status === 201) {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    }
  };


  return (
    <>
      <Layout>
        {verificationModal && (
          <>
            <VerificationModal
              closeModal={closeVerificationModal}
              onConfirm={onVerifiConfirm}
              verificationId={verificationId}
              setVerificationId={setVerificationId}
            />
            <ModalBackground></ModalBackground>
          </>
        )}
        <Wrap>
          <InnerWrap>
            <div className="join-title">회원가입</div>
            <InfoBox>
              {/* yup 적용 */}
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <label htmlFor="memberId">아이디</label>
                  <Essential>*</Essential>
                  <input
                    className="input1"
                    {...register("userId")}
                    placeholder="대소문자, 숫자 포함 최소 5자 이상 입력하세요."
                  />
                  {!userId ? (
                    <CheckButton onClick={idNullBt} type="button">
                      중복 확인
                    </CheckButton>
                  ) : (
                    <CheckButton onClick={idOverlapBt} type="button">
                      중복 확인
                    </CheckButton>
                  )}
                  <div className="message">{errors.userId?.message}</div>
                </FormGroup>
                {catchErr && !idConfirm && !errors.userId && (
                  <div>아이디 중복 확인을 해주세요.</div>
                )}
                <FormGroup>
                  <label htmlFor="password">비밀번호</label>
                  <Essential>*</Essential>
                  <input
                    className="input2"
                    type="password"
                    {...register("password")}
                  />
                  <div className="message">{errors.password?.message}</div>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="checkPassword">
                    비밀번호<span>&nbsp;</span>확인
                  </label>
                  <Essential>*</Essential>
                  <input
                    className="input3"
                    type="password"
                    {...register("passwordCheck")}
                  />
                  <div className="message">{errors.passwordCheck?.message}</div>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="name">이름</label>
                  <Essential>*</Essential>
                  <input className="input4" {...register("name")} />
                  <div className="message">{errors.name?.message}</div>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="nickName">닉네임</label>
                  <Essential>*</Essential>
                  <input className="input5" {...register("nickname")} />
                  {!nickname ? (
                    <CheckButton onClick={nickNameNullBt} type="button">
                      중복 확인
                    </CheckButton>
                  ) : (
                    <CheckButton onClick={nickNameOverlapBt} type="button">
                      중복 확인
                    </CheckButton>
                  )}
                  {/* <CheckButton>중복확인</CheckButton> */}
                  <div className="message">{errors.nickname?.message}</div>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="phone">휴대폰 번호</label>
                  <Essential>*</Essential>
                  <input
                    className="input6"
                    placeholder="휴대폰 번호 예 ) 010-0000-0000"
                    {...register("phone")}
                  />
                  <div className="message">{errors.phone?.message}</div>
                </FormGroup>
                {/* 가입하기 버튼 (빈 칸 있을 시 가입 X) */}
                <div className="join-button">
                {(formState.isValid && nickConfirm && idConfirm) || !userId || !password || !passwordCheck || !name || !nickname || !phone ? (
                    <JoinButton onClick={joinNullBt}>가입하기</JoinButton>
                  ) : (
                    <JoinButton onClick={joinSuccessBt}>가입하기</JoinButton>
                  )}
                </div>
              </form>
            </InfoBox>
          </InnerWrap>
        </Wrap>
      </Layout>
    </>
  );
};

export default JoinPage;
