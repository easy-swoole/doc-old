<template>
  <div class="partner-box">
    <a :href="partner.link" rel="noopener noreferrer" class="partner-one" target="_blank" :title="partner.name" v-for="(partner, index) in partners" :key="index">
      <img :src="partner.icon" alt="">
      <div class="partner-name">{{ partner.name }}</div>
      <div class="detail-card">
        <h4>{{ partner.name }}</h4>
        <p>{{ partner.details }}</p>
      </div>
    </a>
  </div>
</template>

<script>
    export default {
        props: {
            partners: {
                type: Array,
                required: true
            }
        },
    }
</script>

<style>
  .partner {
    margin-top: 60px;
    margin-bottom: 50px;
  }

  .partner-box {
    width: 100%;
    max-width: 1366px;
    text-align: center;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .partner-one {
    position: relative;
    width: 20%;
    padding: 55px 0;
    float: left;
    max-height: 178px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    margin: 1%;
  }

  .partner-one img {
    max-width: 30%;
    padding-bottom: 5px;
    border-radius: 100%;
  }

  .partner-one .partner-name {
    font-size: 18px;
    margin: 10px auto 0;
    color: #4c4c4c;
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (min-width: 100px) and (max-width: 540px) {
    .partner-box {
      width: 328px;
    }

    .partner-one {
      width: 100%;
      margin: 0 0 21px;
    }
  }

  @media screen and (max-width: 960px) {
    /*@media screen and (min-width:540px) and (max-width:960px){*/
    .partner-box {
      width: 540px;
    }

    .partner-one {
      width: 48%;
      margin: 1%;
      margin-bottom: 21px;
    }
  }

  @media screen and (min-width: 960px) and (max-width: 1200px) {
    .partner-box {
      width: 920px;
    }

    .partner-one {
      width: 288px;
    }
  }

  .detail-card {
    visibility: hidden;
    position: absolute;
    opacity: 0;
    left: 0;
    right: 0;
    top: 148px;
    bottom: 0;
    padding: 5px 20px;
    max-width: 100% !important;
    background: #5d9cfd;
    border-radius: 4px;
    text-align: left;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    transition: all .4s;
  }

  .detail-card h4 {
    color: #fff;
    line-height: 30px;
    font-size: 18px;
    font-weight: normal;
    margin-top: 10px;
  }

  .detail-card p {
    color: #fff;
    line-height: 24px;
    font-size: 14px;
    margin: 5px 0 0 0;
    height: 93px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .partner-one:hover .detail-card {
    visibility: visible;
    top: 0;
    opacity: 1;
  }

  @media screen and (max-width: 600px) {
    .partner-box {
      width: 100%;
    }

    .partner-one {
      width: 84%;
      margin: 0 8% 6%;
    }

    .partner-one:hover .detail-card {
      visibility: hidden;
      opacity: 0;
    }

    .hero-btn .btn-blue {
      width: 6rem;
      font-weight: 500;
      margin: 1rem auto 0.8rem auto;
      padding: .4rem .8rem;
      border-radius: 4px;
      font-size: 1rem;
    }
  }
</style>