<template>
    <div>
        <div class="cpn-btns">
            <button class="btn btn-lg btn-grad-borderless shadow-none" @click="showModal = !showModal">Create Wallet</button>
        </div>

        <b-modal ref="create-wallet-modal" @hide="resetModal" v-model="showModal"
                 centered hide-header hide-footer no-close-on-backdrop>
            <button class="modal-close" @click="showModal = false">
                <em class="ti ti-close"></em>
            </button>
            <div class="ath-container p-4">

                <div class="ath-body pad-0">
                    <h5 class="ath-heading title py-4">Create Wallet</h5>

                    <div class="field-item input-focused">
                        <button id="publicKey" class="key input-line text-left text-wrap" v-clipboard:copy="keys.public"
                                v-clipboard:success="onCopy" v-clipboard:error="onError"> {{ keys.public }}
                        </button>
                        <label for="publicKey" class="field-label field-label-line">Wallet Address (Public Key)</label>
                        <span class="pl-2 small text-success" v-if="keys.public">Tap or Click your Wallet Address to copy</span>
                    </div>

                    <div class="field-item input-focused">
                        <button id="privateKey" class="key input-line text-left text-wrap" v-clipboard:copy="keys.private"
                                v-clipboard:success="onCopy" v-clipboard:error="onError"> {{ keys.private }}
                        </button>
                        <label for="privateKey" class="field-label field-label-line">Wallet Key (Private Key)</label>
                        <span class="pl-2 small text-success" v-if="keys.private">Tap or Click your Wallet Key to copy</span>
                    </div>

                    <!-- hcaptcha -->
                    <div class="pb-4 d-flex flex-column align-items-center">
                        <vue-hcaptcha :sitekey="hcaptcha.siteKey" ref="createHcaptcha"
                                      @error="onHcaptchaError" @verify="verifyHcaptcha" @expired="onHcaptchaExpire">
                        </vue-hcaptcha>
                        <div class="small text-danger" v-if="!hcaptcha.verified">{{ hcaptcha.message }}</div>
                    </div>

                    <!-- Create button -->
                    <b-button class="btn btn-grad w-100 border-0 btn-lg" :class="{ 'disabled': busy || !hcaptcha.verified }"
                              @click="create" :disabled="busy || !hcaptcha.verified"
                              v-html="buttonLoading"></b-button>

                    <span v-show="busy" v-html="status"></span>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {BModal, BButton} from 'bootstrap-vue';
    import wallet from 'ethereumjs-wallet';
    import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

    export default {
        name: "CreateWallet",
        components: {
            BModal,
            BButton,
            VueHcaptcha
        },
        data() {
            return {
                showModal: false,
                busy: false,
                buttonLoading: 'Create',
                keys: {
                    public: '',
                    private: ''
                },
                status: 'Please wait ...',
                hcaptcha: {
                    verified: false,
                    message: '',
                    siteKey: process.env.MIX_HCAPTCHA_SITE_KEY
                }
            }
        },
        methods: {
            onCopy(e) {
                alert('Successfully copied: ' + e.text);
            },
            onError(){
                alert('Failed to copy. Try again.');
            },
            resetModal(){
                this.keys.public = '';
                this.keys.private = '';
            },
            create() {
                if(!this.hcaptcha.verified) {
                    this.hcaptcha.message = 'Please let us know that you are not a Robot.';
                    return;
                }

                let myWallet = wallet.generate();
                this.keys.public = myWallet.getAddressString();
                this.keys.private = myWallet.getPrivateKeyString().substring(2);
                this.$refs.createHcaptcha.reset();
                this.hcaptcha.message = '';
                this.hcaptcha.verified = false;
            },
            verifyHcaptcha() {
                this.hcaptcha.message = '';
                this.hcaptcha.verified = true;
            },
            onHcaptchaExpire() {
                alert('Captcha Expired. Please answer again');
                this.hcaptcha.message = '';
                this.hcaptcha.verified = false;
            },
            onHcaptchaError() {
                alert('Captcha Fails.');
                this.hcaptcha.message = '';
                this.hcaptcha.verified = false;
            }
        }
    }
</script>

<style scoped>

    button.key {
        outline-color: transparent;
        cursor: pointer;
        position: relative;
        z-index: 2;
        background: rgba(0, 0, 0, 0.1);
        padding: 30px 15px 15px;
        color: #415076;
        height: 65px;
    }

    button.key:hover {
        background: goldenrod;
        color: darkred;
    }

    button.key + label {
        padding-left: 15px;
        padding-top: 3px;
        top: 0;
        z-index: 2;
    }

    .input-line:focus {
        border-bottom-color: #ffc107;
    }
</style>
