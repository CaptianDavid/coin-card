import styled from "styled-components";

// import BackgroundImg from "../../../assets/images/banner/banner-bg.png";
// //   background-image: url(${BackgroundImg});
const BannerWrapper = styled.section`
  //   background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  // min-height: 100vh;
  // padding: 223px 0 170px 0;
  position: relative;
  z-index: 0;

  &::before {
    z-index: -1;
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.bgBannerV9};
  }

  .banner-title {
    font-weight: 700;
    font-size: 60px;
    line-height: 80px;
    color: ${({ theme }) => theme.colors.white};
  }

  .gittu-banner-list {
    li {
      font-family: ${({ theme }) => theme.fonts.body};
      font-weight: 500;
      font-size: 18px;
      line-height: 40px;
      color: ${({ theme }) => theme.colors.white}cc;
    }

    &.v2 {
      margin-top: 30px;
    }
  }

  .gittu-banner-right {
    width: 512px;
    max-width: 100%;
    // margin: auto
    position: relative;

    .overlay {
      position: absolute;
      z-index: 9;
      top: 1%;
      left: -60px;
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }

    .presale-live-btn {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.bgPresaleBtn};
      backdrop-filter: blur(10px);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        width: 100px !important;
        height: 100px !important;
        animation: rotateImg 15s infinite linear;
      }
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          font-size: 24px;
          color: ${({ theme }) => theme.colors.white};
          transition: 0.3s;
        }
      }

      &:hover {
        .icon svg {
          color: ${({ theme }) => theme.colors.white};
          transform: rotate(-45deg);
        }
      }
    }

    @keyframes rotateImg {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .whitepaper-btn {
    width: fit-content;
    background: ${({ theme }) => theme.colors.primary}26;
    backdrop-filter: blur(7.5px);
    border-radius: 30px;
    border: 0;
    padding: 17px 47px;
    font-family: ${({ theme }) => theme.fonts.outfit};
    font-weight: 700;
    font-size: 15px;
    line-height: 26px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.3s;

    &:hover {
      background: ${({ theme }) => theme.colors.primary}40;
    }
  }

  .gittu-banner-card {
    width: 100%;
    perspective: 1000px;
    position: relative;

    .gittu-banner-card-inner {
      background: ${({ theme }) => theme.colors.white}1a;
      backdrop-filter: blur(5px);
      border-radius: 20px;
      padding: 20px 40px 40px 40px;
      transform-style: preserve-3d;
      transition: transform 0.6s;
      transform: rotateY(0deg);

      .card-content {
        transform: rotateY(0deg);
      }
    }

    &.flip {
      .gittu-banner-card-inner {
        transform: rotateY(180deg);

        .card-content {
          transform: rotateY(180deg);
        }
      }
    }

    .bg-shape-img {
      position: absolute;
      z-index: -1;
      top: 0;
      &.img-1 {
        left: 0;
      }
      &.img-2 {
        right: 0;
      }
    }

    .presale-stage-title {
      margin-left: 40px;
      margin-bottom: 25px;
      font-weight: 500;
      font-size: 15px;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.white};
    }

    .presale-raised {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  .token-info-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding-bottom: 11px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.white}1a;
    }

    li p {
      font-weight: 500;
      font-size: 16px;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.white};
    }
    li p:last-child {
      margin-left: auto; /* pushes it to the right */
      text-align: right; /* ensures multi-line aligns right */
    }
  }

  .presale-back-btn {
    padding-left: 60px;
    margin-bottom: 25px;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.white};

    svg {
      width: 30px;
      height: 30px;
    }
  }

  .presale-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;

    &.start {
      align-items: flex-start;
    }

    .presale-item-inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    h6 {
      font-weight: 500;
      font-size: 15px;
      line-height: 30px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.white};
    }

    input {
      width: 100%;
      padding: 16px;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      background: #1e2939;
      border: 1px solid ${({ theme }) => theme.colors.white}1a;
      border-radius: 12px;
      font-weight: 600;
      font-size: 18px;
      line-height: 18px;
      color: ${({ theme }) => theme.colors.white};
      transition: 0.3s;
      -moz-appearance: textfield; /* Firefox */

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
      }
    }
  }

  .gittu-banner-slider {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .presale-item-msg {
    text-align: center;
    .text-msg {
      margin-bottom: 20px;
      color: ${({ theme }) => theme.colors.white};
    }

    a {
      text-decoration: underline !important;
    }

    &__content {
      margin-bottom: 30px;
      border-radius: 10px;
      padding: 10px 14px;
      background-color: rgba(255, 63, 63, 0.15);
      border: 1px solid rgba(255, 63, 63, 0.15);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }

      &.done {
        background-color: #1dff9626;
        border: 1px solid #1dff9626;
        color: #1dff96;

        a {
          color: #1dff96;
        }
      }

      p {
        font-size: 16px;
        font-weight: 500;
        line-height: 1;
        color: #ff3f3f;
      }
    }
  }

  @media screen and (max-width: 1199px) {
    .banner-title {
      font-size: 50px;
      line-height: 70px;
    }

    .gittu-banner-left {
      h2 {
        font-size: 50px;
        line-height: 70px;
      }
    }
  }

  @media screen and (max-width: 991px) {
    padding: 158px 0 170px 0;

    .gittu-banner-left {
      margin-bottom: 120px;
    }

    .gittu-banner-right {
      margin-left: 0px;
      padding-left: 65px;

      .overlay {
        left: 0px;
      }
    }
  }

  @media screen and (max-width: 575px) {
    padding: 120px 0 120px 0;

    .gittu-banner-right {
      padding-left: 0px;
      .overlay {
        top: 2%;
        img {
          width: 90px;
          height: 90px;
        }
      }

      .presale-live-btn {
        width: 90px;
        height: 90px;
        padding: 10px;
      }
    }

    .presale-item {
      flex-wrap: wrap;
      gap: 15px;
    }

    .gittu-banner-card {
      padding: 20px 0px;
      .gittu-banner-card-inner {
        padding: 20px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .banner-title {
      font-size: 32px;
      line-height: 50px;
    }

    .gittu-banner-left {
      h2 {
        font-size: 32px;
        line-height: 50px;
      }
      h5 {
        font-size: 16px;
      }
    }
  }
`;

export default BannerWrapper;
